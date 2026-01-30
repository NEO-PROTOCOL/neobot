import { getClaudeService } from "../ai/claude-service.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export interface SystemStats {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  timestamp: string;
}

export interface ReportData {
  stats: SystemStats;
  aiUsage: any;
  reminders: number;
  messages: number;
  errors: string[];
  logs: string[];
}

export class IntelligentReportService {
  private claude = getClaudeService();

  /**
   * Coletar estatísticas do sistema
   */
  async collectSystemStats(): Promise<SystemStats> {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Obter logs recentes
   */
  async getRecentLogs(): Promise<string[]> {
    try {
      // Simular logs - em produção, ler de arquivo ou sistema de logs
      return [
        "Sistema iniciado com sucesso",
        "Dashboard API online na porta 3000",
        "Claude AI conectado",
        "Telegram bot ativo",
      ];
    } catch {
      return [];
    }
  }

  /**
   * Obter erros recentes
   */
  async getErrors(): Promise<string[]> {
    try {
      // Simular erros - em produção, ler de sistema de monitoramento
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Obter estatísticas de IA
   */
  async getAIStats(): Promise<any> {
    return this.claude.getStats();
  }

  /**
   * Contar lembretes agendados
   */
  async countReminders(): Promise<number> {
    try {
      const { stdout } = await execAsync("atq | wc -l");
      return parseInt(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Gerar relatório inteligente completo
   */
  async generateIntelligentReport(): Promise<string> {
    // Coletar todos os dados
    const stats = await this.collectSystemStats();
    const aiStats = await this.getAIStats();
    const reminders = await this.countReminders();
    const logs = await this.getRecentLogs();
    const errors = await this.getErrors();

    // Preparar prompt para Claude
    const prompt = `Você é um analista de sistemas. Analise estes dados e gere um relatório executivo profissional:

## 📊 Estatísticas do Sistema
- Uptime: ${Math.floor(stats.uptime / 3600)} horas
- Memória Usada: ${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)} MB
- Memória Total: ${Math.round(stats.memoryUsage.heapTotal / 1024 / 1024)} MB

## 🤖 Uso de IA (Claude)
- Total de Requests: ${aiStats.totalRequests}
- Tokens Consumidos: ${aiStats.totalTokens}
- Custo Total: $${aiStats.totalCost.toFixed(4)}
- Tempo Médio: ${aiStats.avgResponseTime}ms

## 📅 Lembretes
- Agendados: ${reminders}

## 📝 Logs Importantes
${logs.map((log) => `- ${log}`).join("\n")}

## ❌ Erros Encontrados
${errors.length > 0 ? errors.map((err) => `- ${err}`).join("\n") : "- Nenhum erro detectado"}

---

Por favor, gere um relatório com:

### 1. 📈 Resumo Executivo
Visão geral do desempenho do sistema hoje.

### 2. 🎯 Métricas Principais
Destaque os números mais importantes.

### 3. ⚠️ Problemas Identificados
Liste qualquer problema ou área de atenção.

### 4. ✅ Ações Recomendadas
Sugira melhorias ou ações necessárias.

### 5. 🔮 Previsões
Tendências e expectativas para os próximos dias.

Seja conciso, objetivo e forneça insights acionáveis.`;

    try {
      const response = await this.claude.chat(prompt, { model: "claude-sonnet-4-20250514" });
      return response;
    } catch {
      return this.generateFallbackReport(stats, aiStats, reminders, logs, errors);
    }
  }

  /**
   * Gerar relatório básico (fallback)
   */
  private generateFallbackReport(
    stats: SystemStats,
    aiStats: any,
    reminders: number,
    logs: string[],
    errors: string[],
  ): string {
    return `
📊 **Relatório do Sistema - ${new Date().toLocaleDateString("pt-BR")}**

### 📈 Resumo Executivo
Sistema operando normalmente há ${Math.floor(stats.uptime / 3600)} horas.

### 🎯 Métricas Principais
- 🤖 IA: ${aiStats.totalRequests} requests, ${aiStats.totalTokens} tokens
- 💰 Custo: $${aiStats.totalCost.toFixed(4)}
- 📅 Lembretes: ${reminders} agendados
- 💾 Memória: ${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)} MB

### ⚠️ Status
${errors.length > 0 ? "⚠️ Erros detectados" : "✅ Sistema saudável"}

### ✅ Ações Recomendadas
- Continuar monitoramento
- Revisar logs periodicamente
    `.trim();
  }

  /**
   * Gerar relatório em formato JSON
   */
  async generateReportData(): Promise<ReportData> {
    return {
      stats: await this.collectSystemStats(),
      aiUsage: await this.getAIStats(),
      reminders: await this.countReminders(),
      messages: 0, // TODO: implementar contador
      errors: await this.getErrors(),
      logs: await this.getRecentLogs(),
    };
  }

  /**
   * Salvar relatório em arquivo
   */
  async saveReport(report: string): Promise<string> {
    const reportsDir = path.join(process.cwd(), "reports");

    try {
      await fs.mkdir(reportsDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    const filename = `report-${new Date().toISOString().split("T")[0]}.md`;
    const filepath = path.join(reportsDir, filename);

    await fs.writeFile(filepath, report, "utf-8");

    return filepath;
  }
}

// Singleton instance
let reportServiceInstance: IntelligentReportService | null = null;

export function getReportService(): IntelligentReportService {
  if (!reportServiceInstance) {
    reportServiceInstance = new IntelligentReportService();
  }
  return reportServiceInstance;
}
