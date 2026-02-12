import Anthropic from '@anthropic-ai/sdk';

/**
 * Mensagem no formato Claude
 */
interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Configuração do serviço Claude
 */
interface ClaudeConfig {
    apiKey?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

/**
 * Serviço de integração com Claude AI
 * 
 * Fornece chat inteligente com contexto, geração de código,
 * análise de textos e muito mais.
 * 
 * @example
 * ```typescript
 * const claude = new ClaudeService();
 * const response = await claude.chat('user123', 'Olá!');
 * console.log(response);
 * ```
 */
export class ClaudeService {
    private client: Anthropic;
    private conversationHistory: Map<string, ClaudeMessage[]>;
    private model: string;
    private maxTokens: number;
    private temperature?: number;

    constructor(config: ClaudeConfig = {}) {
        const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY não encontrada. Configure no .env');
        }

        this.client = new Anthropic({ apiKey });
        this.conversationHistory = new Map();
        this.model = config.model || 'claude-sonnet-4-5-20250929';
        this.maxTokens = config.maxTokens || 1024;
        this.temperature = config.temperature;
    }

    /**
     * Conversa com Claude mantendo contexto
     * 
     * @param userId - ID único do usuário (para manter histórico separado)
     * @param message - Mensagem do usuário
     * @param context - Contexto adicional opcional
     * @returns Resposta do Claude
     */
    async chat(userId: string, message: string, context?: string): Promise<string> {
        try {
            // Recuperar histórico do usuário
            const history = this.conversationHistory.get(userId) || [];

            // Adicionar nova mensagem
            history.push({
                role: 'user',
                content: message
            });

            // Criar system prompt personalizado
            const systemPrompt = this.buildSystemPrompt(context);

            // Chamar Claude
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: this.maxTokens,
                system: systemPrompt,
                messages: history,
                ...(this.temperature !== undefined && { temperature: this.temperature })
            });

            // Extrair resposta
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Resposta inesperada do Claude');
            }

            const assistantMessage = content.text;

            // Adicionar resposta ao histórico
            history.push({
                role: 'assistant',
                content: assistantMessage
            });

            // Limitar histórico (últimas 20 mensagens = 10 trocas)
            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }

            this.conversationHistory.set(userId, history);

            return assistantMessage;

        } catch (error) {
            console.error('Erro ao chamar Claude:', error);

            if (error instanceof Anthropic.APIError) {
                if (error.status === 429) {
                    throw new Error('Limite de requisições excedido. Tente novamente em alguns segundos.');
                }
                if (error.status === 401) {
                    throw new Error('API key inválida. Verifique sua configuração.');
                }
            }

            throw new Error('Erro ao processar mensagem com Claude');
        }
    }

    /**
     * Constrói o system prompt baseado no contexto
     */
    private buildSystemPrompt(context?: string): string {
        let prompt = `Você é o NeoBot, um assistente inteligente focado em automação e produtividade.

Características:
- Responda de forma concisa e objetiva
- Use emojis quando apropriado para tornar a conversa mais amigável
- Seja prestativo e proativo
- Forneça exemplos práticos quando possível
- Se não souber algo, admita honestamente
- Ao gerar código, sempre explique o que ele faz
- Use markdown para formatar respostas quando relevante`;

        if (context) {
            prompt += `\n\nContexto adicional: ${context}`;
        }

        return prompt;
    }

    /**
     * Limpa o histórico de conversação de um usuário
     */
    clearHistory(userId: string): void {
        this.conversationHistory.delete(userId);
    }

    /**
     * Obtém o histórico de conversação de um usuário
     */
    getHistory(userId: string): ClaudeMessage[] {
        return this.conversationHistory.get(userId) || [];
    }

    /**
     * Analisa um documento ou texto longo
     * 
     * @param userId - ID do usuário
     * @param fileContent - Conteúdo do documento
     * @param prompt - O que fazer com o documento (resumir, analisar, etc)
     */
    async analyzeDocument(
        userId: string,
        fileContent: string,
        prompt: string
    ): Promise<string> {
        return await this.chat(
            userId,
            `${prompt}\n\nConteúdo do documento:\n\`\`\`\n${fileContent}\n\`\`\``,
            'análise de documento'
        );
    }

    /**
     * Gera código em uma linguagem específica
     * 
     * @param userId - ID do usuário
     * @param description - Descrição do que o código deve fazer
     * @param language - Linguagem de programação
     */
    async generateCode(
        userId: string,
        description: string,
        language: string
    ): Promise<string> {
        return await this.chat(
            userId,
            `Gere código em ${language} para: ${description}\n\nRetorne APENAS o código, sem explicações adicionais.`,
            'geração de código'
        );
    }

    /**
     * Resume um texto longo
     * 
     * @param userId - ID do usuário
     * @param text - Texto a ser resumido
     * @param maxLength - Tamanho máximo do resumo (em palavras)
     */
    async summarize(
        userId: string,
        text: string,
        maxLength: number = 100
    ): Promise<string> {
        return await this.chat(
            userId,
            `Resuma o seguinte texto em no máximo ${maxLength} palavras:\n\n${text}`,
            'resumo de texto'
        );
    }

    /**
     * Traduz texto entre idiomas
     * 
     * @param userId - ID do usuário
     * @param text - Texto a traduzir
     * @param targetLanguage - Idioma de destino
     */
    async translate(
        userId: string,
        text: string,
        targetLanguage: string
    ): Promise<string> {
        return await this.chat(
            userId,
            `Traduza o seguinte texto para ${targetLanguage}:\n\n${text}`,
            'tradução'
        );
    }

    /**
     * Obtém estatísticas do serviço
     */
    getStats() {
        return {
            activeConversations: this.conversationHistory.size,
            totalMessages: Array.from(this.conversationHistory.values())
                .reduce((sum, history) => sum + history.length, 0),
            model: this.model,
            maxTokens: this.maxTokens
        };
    }
}
