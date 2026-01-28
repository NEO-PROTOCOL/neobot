import { getClaudeService } from "../ai/claude-service.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export interface DeployChecklist {
  tests: string[];
  migrations: string[];
  envVars: string[];
  rollbackPlan: string[];
  deployOrder: string[];
  warnings: string[];
  recommendations: string[];
}

export interface CodeReview {
  bugs: string[];
  performance: string[];
  security: string[];
  codeSmells: string[];
  improvements: string[];
  score: number;
}

export class DeployAssistant {
  private claude = getClaudeService();

  /**
   * Preparar checklist de deploy analisando mudanças
   */
  async prepareDeploy(changes: string[]): Promise<DeployChecklist> {
    const prompt = `Você é um engenheiro de DevOps sênior. Analise estas mudanças e crie um checklist completo de deploy:

## Mudanças Identificadas:
${changes.map((change, i) => `${i + 1}. ${change}`).join("\n")}

---

Por favor, gere um checklist estruturado com:

### 1. 🧪 Testes Necessários
Liste os testes que devem ser executados antes do deploy (unitários, integração, e2e, etc.)

### 2. 🗄️ Migrations de Banco de Dados
Identifique se há mudanças no schema do banco que requerem migrations

### 3. 🔐 Variáveis de Ambiente
Liste novas variáveis de ambiente necessárias ou mudanças em variáveis existentes

### 4. ⏮️ Plano de Rollback
Descreva o plano de rollback caso algo dê errado

### 5. 📋 Ordem de Deploy
Liste a ordem recomendada de deploy (ex: banco primeiro, depois API, depois frontend)

### 6. ⚠️ Avisos Importantes
Liste qualquer aviso crítico ou atenção especial necessária

### 7. 💡 Recomendações
Sugestões de melhoria ou otimizações

Seja específico, prático e focado em segurança e estabilidade.`;

    try {
      const response = await this.claude.chat(prompt);

      // Parse response into structured checklist
      return this.parseChecklistResponse(response);
    } catch (error) {
      console.error("Erro ao gerar checklist de deploy:", error);
      return this.generateFallbackChecklist(changes);
    }
  }

  /**
   * Revisar código (diff) como engenheiro sênior
   */
  async reviewCode(diff: string): Promise<CodeReview> {
    const prompt = `Você é um engenheiro sênior revisando código. Analise este diff e forneça uma revisão completa:

## Diff do Código:
\`\`\`
${diff}
\`\`\`

---

Por favor, identifique e liste:

### 1. 🐛 Bugs Potenciais
Problemas que podem causar erros em runtime ou comportamento inesperado

### 2. ⚡ Problemas de Performance
Código que pode ser lento, ineficiente ou causar problemas de escalabilidade

### 3. 🔒 Vulnerabilidades de Segurança
Problemas de segurança, exposição de dados, validação inadequada, etc.

### 4. 👃 Code Smells
Padrões de código que funcionam mas não são ideais (duplicação, complexidade, etc.)

### 5. 💡 Sugestões de Melhoria
Como o código pode ser melhorado em termos de legibilidade, manutenibilidade, etc.

### 6. 📊 Score (0-100)
Dê uma nota de 0 a 100 para a qualidade geral do código

Seja crítico mas construtivo. Foque em problemas reais que podem causar impacto.`;

    try {
      const response = await this.claude.chat(prompt);
      return this.parseCodeReviewResponse(response);
    } catch (error) {
      console.error("Erro ao revisar código:", error);
      return this.generateFallbackReview();
    }
  }

  /**
   * Obter diff do Git
   */
  async getGitDiff(branch: string = "main"): Promise<string> {
    try {
      const { stdout } = await execAsync(`git diff ${branch}...HEAD`);
      return stdout;
    } catch (error) {
      console.error("Erro ao obter diff do Git:", error);
      return "";
    }
  }

  /**
   * Obter lista de arquivos alterados
   */
  async getChangedFiles(branch: string = "main"): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`git diff --name-only ${branch}...HEAD`);
      return stdout
        .trim()
        .split("\n")
        .filter((f) => f.length > 0);
    } catch (error) {
      console.error("Erro ao obter arquivos alterados:", error);
      return [];
    }
  }

  /**
   * Obter estatísticas do diff
   */
  async getDiffStats(branch: string = "main"): Promise<{
    filesChanged: number;
    insertions: number;
    deletions: number;
    files: string[];
  }> {
    try {
      const files = await this.getChangedFiles(branch);
      const { stdout } = await execAsync(`git diff --shortstat ${branch}...HEAD`);

      // Parse: "2 files changed, 15 insertions(+), 5 deletions(-)"
      const match = stdout.match(/(\d+) files? changed.*?(\d+) insertions?.*?(\d+) deletions?/);

      return {
        filesChanged: files.length,
        insertions: match ? parseInt(match[2]) : 0,
        deletions: match ? parseInt(match[3]) : 0,
        files,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas do diff:", error);
      return {
        filesChanged: 0,
        insertions: 0,
        deletions: 0,
        files: [],
      };
    }
  }

  /**
   * Analisar mudanças e gerar checklist completo
   */
  async analyzeChanges(branch: string = "main"): Promise<{
    stats: { filesChanged: number; insertions: number; deletions: number; files: string[] };
    checklist: DeployChecklist;
    review?: CodeReview;
  }> {
    const stats = await this.getDiffStats(branch);
    const files = stats.files;

    // Preparar lista de mudanças
    const changes = files.map((file) => {
      // Tentar identificar tipo de mudança pelo nome do arquivo
      if (file.includes("migration") || file.includes("schema")) {
        return `🗄️ Mudança no banco de dados: ${file}`;
      }
      if (file.includes("test") || file.includes("spec")) {
        return `🧪 Teste: ${file}`;
      }
      if (file.includes(".env") || file.includes("config")) {
        return `🔐 Configuração: ${file}`;
      }
      return `📝 Arquivo modificado: ${file}`;
    });

    const checklist = await this.prepareDeploy(changes);

    // Se houver código alterado, fazer code review
    let review: CodeReview | undefined;
    const codeFiles = files.filter(
      (f) => f.endsWith(".ts") || f.endsWith(".js") || f.endsWith(".tsx") || f.endsWith(".jsx"),
    );

    if (codeFiles.length > 0) {
      const diff = await this.getGitDiff(branch);
      if (diff) {
        review = await this.reviewCode(diff);
      }
    }

    return {
      stats,
      checklist,
      review,
    };
  }

  /**
   * Salvar análise em arquivo
   */
  async saveAnalysis(analysis: {
    stats: any;
    checklist: DeployChecklist;
    review?: CodeReview;
  }): Promise<string> {
    const reportsDir = path.join(process.cwd(), "reports", "deploy");

    try {
      await fs.mkdir(reportsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `deploy-analysis-${timestamp}.md`;
    const filepath = path.join(reportsDir, filename);

    const content = this.formatAnalysisReport(analysis);
    await fs.writeFile(filepath, content, "utf-8");

    return filepath;
  }

  /**
   * Formatar relatório de análise
   */
  private formatAnalysisReport(analysis: {
    stats: any;
    checklist: DeployChecklist;
    review?: CodeReview;
  }): string {
    const { stats, checklist, review } = analysis;

    let report = `# 📦 Análise de Deploy\n\n`;
    report += `**Data:** ${new Date().toLocaleString("pt-BR")}\n\n`;

    report += `## 📊 Estatísticas\n\n`;
    report += `- Arquivos alterados: ${stats.filesChanged}\n`;
    report += `- Linhas adicionadas: ${stats.insertions}\n`;
    report += `- Linhas removidas: ${stats.deletions}\n\n`;

    report += `## ✅ Checklist de Deploy\n\n`;
    report += `### 🧪 Testes Necessários\n`;
    checklist.tests.forEach((test) => (report += `- ${test}\n`));
    report += `\n`;

    report += `### 🗄️ Migrations\n`;
    checklist.migrations.forEach((migration) => (report += `- ${migration}\n`));
    report += `\n`;

    report += `### 🔐 Variáveis de Ambiente\n`;
    checklist.envVars.forEach((env) => (report += `- ${env}\n`));
    report += `\n`;

    report += `### ⏮️ Plano de Rollback\n`;
    checklist.rollbackPlan.forEach((step) => (report += `- ${step}\n`));
    report += `\n`;

    report += `### 📋 Ordem de Deploy\n`;
    checklist.deployOrder.forEach(
      (step) => (report += `${checklist.deployOrder.indexOf(step) + 1}. ${step}\n`),
    );
    report += `\n`;

    if (checklist.warnings.length > 0) {
      report += `### ⚠️ Avisos\n`;
      checklist.warnings.forEach((warning) => (report += `- ${warning}\n`));
      report += `\n`;
    }

    if (checklist.recommendations.length > 0) {
      report += `### 💡 Recomendações\n`;
      checklist.recommendations.forEach((rec) => (report += `- ${rec}\n`));
      report += `\n`;
    }

    if (review) {
      report += `## 🔍 Code Review\n\n`;
      report += `**Score:** ${review.score}/100\n\n`;

      if (review.bugs.length > 0) {
        report += `### 🐛 Bugs Potenciais\n`;
        review.bugs.forEach((bug) => (report += `- ${bug}\n`));
        report += `\n`;
      }

      if (review.performance.length > 0) {
        report += `### ⚡ Performance\n`;
        review.performance.forEach((perf) => (report += `- ${perf}\n`));
        report += `\n`;
      }

      if (review.security.length > 0) {
        report += `### 🔒 Segurança\n`;
        review.security.forEach((sec) => (report += `- ${sec}\n`));
        report += `\n`;
      }

      if (review.codeSmells.length > 0) {
        report += `### 👃 Code Smells\n`;
        review.codeSmells.forEach((smell) => (report += `- ${smell}\n`));
        report += `\n`;
      }

      if (review.improvements.length > 0) {
        report += `### 💡 Melhorias\n`;
        review.improvements.forEach((imp) => (report += `- ${imp}\n`));
        report += `\n`;
      }
    }

    return report;
  }

  /**
   * Parse checklist response from Claude
   */
  private parseChecklistResponse(response: string): DeployChecklist {
    const checklist: DeployChecklist = {
      tests: [],
      migrations: [],
      envVars: [],
      rollbackPlan: [],
      deployOrder: [],
      warnings: [],
      recommendations: [],
    };

    // Extract sections using regex
    const extractList = (section: string, text: string): string[] => {
      const regex = new RegExp(`${section}[\\s\\S]*?(-|\\d+\\.)\\s*(.+?)(?=\\n###|\\n##|$)`, "gi");
      const matches = [...text.matchAll(regex)];
      return matches.map((m) => m[3]?.trim()).filter(Boolean);
    };

    checklist.tests = extractList("Testes", response);
    checklist.migrations = extractList("Migrations", response);
    checklist.envVars = extractList("Variáveis|Environment", response);
    checklist.rollbackPlan = extractList("Rollback", response);
    checklist.deployOrder = extractList("Ordem|Order", response);
    checklist.warnings = extractList("Avisos|Warnings", response);
    checklist.recommendations = extractList("Recomendações|Recommendations", response);

    // Fallback: if parsing failed, use simple line extraction
    if (checklist.tests.length === 0) {
      const lines = response.split("\n");
      let currentSection = "";
      lines.forEach((line) => {
        if (line.includes("Testes")) currentSection = "tests";
        else if (line.includes("Migrations")) currentSection = "migrations";
        else if (line.includes("Variáveis") || line.includes("Environment"))
          currentSection = "envVars";
        else if (line.includes("Rollback")) currentSection = "rollbackPlan";
        else if (line.includes("Ordem") || line.includes("Order")) currentSection = "deployOrder";
        else if (line.includes("Avisos") || line.includes("Warnings")) currentSection = "warnings";
        else if (line.includes("Recomendações") || line.includes("Recommendations"))
          currentSection = "recommendations";
        else if (line.trim().startsWith("-") || line.trim().match(/^\d+\./)) {
          const item = line.replace(/^[-•]\s*|\d+\.\s*/, "").trim();
          if (item && currentSection && checklist[currentSection as keyof DeployChecklist]) {
            (checklist[currentSection as keyof DeployChecklist] as string[]).push(item);
          }
        }
      });
    }

    return checklist;
  }

  /**
   * Parse code review response from Claude
   */
  private parseCodeReviewResponse(response: string): CodeReview {
    const review: CodeReview = {
      bugs: [],
      performance: [],
      security: [],
      codeSmells: [],
      improvements: [],
      score: 70, // Default score
    };

    // Extract score
    const scoreMatch = response.match(/score[:\s]+(\d+)/i);
    if (scoreMatch) {
      review.score = parseInt(scoreMatch[1]);
    }

    // Extract sections
    const extractList = (section: string, text: string): string[] => {
      const regex = new RegExp(`${section}[\\s\\S]*?(-|\\d+\\.)\\s*(.+?)(?=\\n###|\\n##|$)`, "gi");
      const matches = [...text.matchAll(regex)];
      return matches.map((m) => m[3]?.trim()).filter(Boolean);
    };

    review.bugs = extractList("Bugs|Bug", response);
    review.performance = extractList("Performance", response);
    review.security = extractList("Segurança|Security", response);
    review.codeSmells = extractList("Code Smells|Smells", response);
    review.improvements = extractList("Melhorias|Improvements|Sugestões", response);

    return review;
  }

  /**
   * Generate fallback checklist
   */
  private generateFallbackChecklist(changes: string[]): DeployChecklist {
    return {
      tests: ["Executar testes unitários", "Executar testes de integração"],
      migrations: changes.some((c) => c.includes("migration"))
        ? ["Verificar migrations pendentes", "Executar migrations em staging primeiro"]
        : ["Nenhuma migration detectada"],
      envVars: changes.some((c) => c.includes(".env"))
        ? ["Revisar variáveis de ambiente", "Atualizar documentação de env vars"]
        : ["Nenhuma mudança em variáveis de ambiente"],
      rollbackPlan: [
        "Manter backup do banco de dados",
        "Ter versão anterior do código disponível",
        "Documentar comandos de rollback",
      ],
      deployOrder: [
        "1. Executar migrations (se houver)",
        "2. Deploy do backend",
        "3. Deploy do frontend",
        "4. Verificar health checks",
        "5. Monitorar logs por 15 minutos",
      ],
      warnings: [],
      recommendations: ["Revisar logs após deploy", "Monitorar métricas de performance"],
    };
  }

  /**
   * Generate fallback code review
   */
  private generateFallbackReview(): CodeReview {
    return {
      bugs: [],
      performance: [],
      security: [],
      codeSmells: [],
      improvements: ["Revisar código manualmente"],
      score: 70,
    };
  }
}

// Singleton instance
let deployAssistantInstance: DeployAssistant | null = null;

export function getDeployAssistant(): DeployAssistant {
  if (!deployAssistantInstance) {
    deployAssistantInstance = new DeployAssistant();
  }
  return deployAssistantInstance;
}
