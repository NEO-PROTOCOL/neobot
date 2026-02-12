import { getClaudeService } from '../../../dashboard/ai-routes.js';

export interface SkillResponse {
    success: boolean;
    message: string;
    data?: any;
}

export class BugAnalyzerSkill {
    name = 'bug-analyzer';
    description = 'Analisa e sugere correções para bugs';
    commands = ['/bug', '/fix', '/debug'];

    private claude = getClaudeService();

    async execute(errorMessage: string, codeContext?: string): Promise<SkillResponse> {
        if (!errorMessage) {
            return {
                success: false,
                message: '❌ Por favor, forneça uma mensagem de erro ou descrição do bug.'
            };
        }

        try {
            const prompt = this.buildAnalysisPrompt(errorMessage, codeContext);
            const response = await this.claude.chat(prompt, 'bug-analyzer');

            return {
                success: true,
                message: response.message,
                data: {
                    usage: response.usage,
                    responseTime: response.responseTime
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Erro ao analisar bug: ${error.message}`
            };
        }
    }

    private buildAnalysisPrompt(errorMessage: string, codeContext?: string): string {
        let prompt = `Você é um especialista em debugging. Analise este erro e forneça uma análise completa:

## 🐛 Erro Reportado:
${errorMessage}
`;

        if (codeContext) {
            prompt += `
## 💻 Contexto do Código:
\`\`\`
${codeContext}
\`\`\`
`;
        }

        prompt += `
Por favor, forneça:

### 1. 🔍 Causa Provável
Explique qual é a causa mais provável deste erro.

### 2. 🔄 Como Reproduzir
Descreva os passos para reproduzir o erro.

### 3. ✅ Solução Passo-a-Passo
Forneça instruções claras para corrigir o problema.

### 4. 💡 Código Corrigido
Se aplicável, mostre o código corrigido.

### 5. 🛡️ Prevenção Futura
Dê dicas para evitar este tipo de erro no futuro.

Seja específico, claro e forneça exemplos práticos.
`;

        return prompt;
    }

    /**
     * Análise rápida de erro (sem contexto detalhado)
     */
    async quickAnalyze(errorMessage: string): Promise<string> {
        const response = await this.execute(errorMessage);
        return response.message;
    }

    /**
     * Análise profunda com contexto de código
     */
    async deepAnalyze(errorMessage: string, codeContext: string): Promise<string> {
        const response = await this.execute(errorMessage, codeContext);
        return response.message;
    }

    /**
     * Sugerir fix para código específico
     */
    async suggestFix(code: string, issue: string): Promise<SkillResponse> {
        const prompt = `Analise este código e sugira uma correção para o seguinte problema:

**Problema:** ${issue}

**Código:**
\`\`\`
${code}
\`\`\`

Forneça:
1. O que está errado
2. Código corrigido
3. Explicação da correção
`;

        try {
            const response = await this.claude.chat(prompt, 'bug-fixer');

            return {
                success: true,
                message: response.message,
                data: { usage: response.usage }
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Erro ao sugerir correção: ${error.message}`
            };
        }
    }

    /**
     * Analisar stack trace
     */
    async analyzeStackTrace(stackTrace: string): Promise<SkillResponse> {
        const prompt = `Analise este stack trace e identifique:

1. Onde o erro ocorreu (arquivo e linha)
2. Qual é o erro
3. Possíveis causas
4. Como corrigir

**Stack Trace:**
\`\`\`
${stackTrace}
\`\`\`
`;

        try {
            const response = await this.claude.chat(prompt, 'stack-analyzer');

            return {
                success: true,
                message: response.message
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Erro ao analisar stack trace: ${error.message}`
            };
        }
    }
}

// Singleton instance
let bugAnalyzerInstance: BugAnalyzerSkill | null = null;

export function getBugAnalyzer(): BugAnalyzerSkill {
    if (!bugAnalyzerInstance) {
        bugAnalyzerInstance = new BugAnalyzerSkill();
    }
    return bugAnalyzerInstance;
}
