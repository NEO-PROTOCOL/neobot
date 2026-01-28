import Anthropic from "@anthropic-ai/sdk";
import { loadDotEnv } from "../../infra/dotenv.js";

loadDotEnv();

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationContext {
  userId: string;
  history: Message[];
  metadata: {
    preferences?: Record<string, any>;
    tags?: string[];
    summary?: string;
  };
}

export class ClaudeService {
  private client: Anthropic;
  private contexts: Map<string, ConversationContext> = new Map();

  // Stats tracking
  private stats = {
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    errors: 0,
    responseTimes: [] as number[],
  };

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not found in environment");
    }

    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  /**
   * Chat simples sem contexto
   */
  async chat(
    message: string,
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    },
  ): Promise<string> {
    const startTime = Date.now();

    try {
      const response = await this.client.messages.create({
        model: options?.model || "claude-sonnet-4-20250514",
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 1.0,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

      const responseTime = Date.now() - startTime;
      this.trackRequest(response.usage, responseTime);

      const content = response.content[0];
      if (content.type === "text") {
        return content.text;
      }

      return "Resposta não textual recebida";
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Chat com contexto de conversa
   */
  async chatWithContext(userId: string, message: string): Promise<string> {
    let context = this.contexts.get(userId);

    if (!context) {
      context = {
        userId,
        history: [],
        metadata: {},
      };
      this.contexts.set(userId, context);
    }

    // Adicionar mensagem do usuário
    context.history.push({
      role: "user",
      content: message,
    });

    // Auto-resumir a cada 20 mensagens
    if (context.history.length > 20) {
      await this.summarizeContext(userId);
    }

    const startTime = Date.now();

    try {
      // Preparar mensagens com contexto
      const messages = context.history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: messages as any,
      });

      const responseTime = Date.now() - startTime;
      this.trackRequest(response.usage, responseTime);

      const content = response.content[0];
      if (content.type === "text") {
        const assistantMessage = content.text;

        // Adicionar resposta ao histórico
        context.history.push({
          role: "assistant",
          content: assistantMessage,
        });

        return assistantMessage;
      }

      return "Resposta não textual recebida";
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Análise de imagem
   */
  async analyzeImage(
    base64Image: string,
    question: string = "Descreva esta imagem",
  ): Promise<string> {
    const startTime = Date.now();

    try {
      const response = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: question,
              },
            ],
          },
        ],
      });

      const responseTime = Date.now() - startTime;
      this.trackRequest(response.usage, responseTime);

      const content = response.content[0];
      if (content.type === "text") {
        return content.text;
      }

      return "Não foi possível analisar a imagem";
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Criar plano de ação para tarefa complexa
   */
  async createPlan(task: string): Promise<string[]> {
    const response = await this
      .chat(`Você é um agente de planejamento. Quebre esta tarefa em etapas executáveis:

Tarefa: ${task}

Retorne APENAS um array JSON de etapas, exemplo:
["buscar informação X", "processar dados Y", "gerar relatório Z"]`);

    // Extrair JSON da resposta
    const jsonMatch = response.match(/\[.*\]/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return [task];
      }
    }

    return [task];
  }

  /**
   * Resumir contexto de conversa
   */
  private async summarizeContext(userId: string): Promise<void> {
    const context = this.contexts.get(userId);
    if (!context) return;

    const historyText = context.history.map((m) => `${m.role}: ${m.content}`).join("\n");

    const summary = await this.chat(
      `Resuma esta conversa em 3-5 pontos principais:\n\n${historyText}`,
    );

    context.metadata.summary = summary;

    // Manter apenas últimas 10 mensagens + resumo
    context.history = context.history.slice(-10);
  }

  /**
   * Limpar contexto de usuário
   */
  clearContext(userId: string): void {
    this.contexts.delete(userId);
  }

  /**
   * Obter contexto de usuário
   */
  getContext(userId: string): ConversationContext | undefined {
    return this.contexts.get(userId);
  }

  /**
   * Tracking de métricas
   */
  private trackRequest(usage: any, responseTime: number): void {
    this.stats.totalRequests++;
    this.stats.totalTokens += usage.input_tokens + usage.output_tokens;
    this.stats.responseTimes.push(responseTime);

    // Calcular custo aproximado (Claude Sonnet 4)
    // Input: $3/M tokens, Output: $15/M tokens
    const inputCost = (usage.input_tokens / 1_000_000) * 3;
    const outputCost = (usage.output_tokens / 1_000_000) * 15;
    this.stats.totalCost += inputCost + outputCost;
  }

  /**
   * Obter estatísticas
   */
  getStats() {
    const avgResponseTime =
      this.stats.responseTimes.length > 0
        ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
        : 0;

    return {
      totalRequests: this.stats.totalRequests,
      totalTokens: this.stats.totalTokens,
      totalCost: this.stats.totalCost,
      errors: this.stats.errors,
      avgResponseTime: Math.round(avgResponseTime),
      avgCostPerRequest:
        this.stats.totalRequests > 0 ? this.stats.totalCost / this.stats.totalRequests : 0,
    };
  }

  /**
   * Gerar relatório de uso
   */
  async generateReport(): Promise<string> {
    const stats = this.getStats();

    return `
📊 *Relatório Claude AI*

📨 Total de Requests: ${stats.totalRequests}
🎯 Tokens Usados: ${stats.totalTokens.toLocaleString()}
⚡ Tempo Médio: ${stats.avgResponseTime}ms
❌ Erros: ${stats.errors}
💰 Custo Total: $${stats.totalCost.toFixed(4)}
💵 Custo/Request: $${stats.avgCostPerRequest.toFixed(6)}
    `.trim();
  }
}

// Singleton instance
let claudeInstance: ClaudeService | null = null;

export function getClaudeService(): ClaudeService {
  if (!claudeInstance) {
    claudeInstance = new ClaudeService();
  }
  return claudeInstance;
}
