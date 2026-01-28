import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

class ClaudeService {
    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY not found in environment');
        }

        this.client = new Anthropic({ apiKey });

        // Stats tracking
        this.stats = {
            totalRequests: 0,
            totalTokens: 0,
            totalCost: 0,
            errors: 0,
            responseTimes: []
        };

        // Conversation contexts
        this.contexts = new Map();
    }

    async chat(message, userId = 'default') {
        const startTime = Date.now();

        try {
            // Get or create context
            let context = this.contexts.get(userId);
            if (!context) {
                context = { history: [] };
                this.contexts.set(userId, context);
            }

            // Add user message to history
            context.history.push({
                role: 'user',
                content: message
            });

            // Keep only last 10 messages
            if (context.history.length > 20) {
                context.history = context.history.slice(-10);
            }

            const response = await this.client.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: context.history
            });

            const responseTime = Date.now() - startTime;
            this.trackRequest(response.usage, responseTime);

            const assistantMessage = response.content[0].text;

            // Add assistant response to history
            context.history.push({
                role: 'assistant',
                content: assistantMessage
            });

            return {
                message: assistantMessage,
                usage: response.usage,
                responseTime
            };

        } catch (error) {
            this.stats.errors++;
            throw error;
        }
    }

    async analyzeImage(base64Image, question = 'Descreva esta imagem em detalhes') {
        const startTime = Date.now();

        try {
            const response = await this.client.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: base64Image
                            }
                        },
                        {
                            type: 'text',
                            text: question
                        }
                    ]
                }]
            });

            const responseTime = Date.now() - startTime;
            this.trackRequest(response.usage, responseTime);

            return {
                analysis: response.content[0].text,
                usage: response.usage,
                responseTime
            };

        } catch (error) {
            this.stats.errors++;
            throw error;
        }
    }

    async createPlan(task) {
        const response = await this.chat(`Você é um agente de planejamento. Quebre esta tarefa em etapas executáveis:

Tarefa: ${task}

Retorne APENAS um array JSON de etapas, exemplo:
["buscar informação X", "processar dados Y", "gerar relatório Z"]`, 'planner');

        // Extract JSON from response
        const jsonMatch = response.message.match(/\[.*\]/s);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {
                return [task];
            }
        }

        return [task];
    }

    clearContext(userId) {
        this.contexts.delete(userId);
    }

    trackRequest(usage, responseTime) {
        this.stats.totalRequests++;
        this.stats.totalTokens += usage.input_tokens + usage.output_tokens;
        this.stats.responseTimes.push(responseTime);

        // Calculate cost (Claude Sonnet 4)
        // Input: $3/M tokens, Output: $15/M tokens
        const inputCost = (usage.input_tokens / 1_000_000) * 3;
        const outputCost = (usage.output_tokens / 1_000_000) * 15;
        this.stats.totalCost += inputCost + outputCost;
    }

    getStats() {
        const avgResponseTime = this.stats.responseTimes.length > 0
            ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
            : 0;

        return {
            totalRequests: this.stats.totalRequests,
            totalTokens: this.stats.totalTokens,
            totalCost: this.stats.totalCost,
            errors: this.stats.errors,
            avgResponseTime: Math.round(avgResponseTime),
            avgCostPerRequest: this.stats.totalRequests > 0
                ? this.stats.totalCost / this.stats.totalRequests
                : 0
        };
    }
}

// Singleton instance
let claudeInstance = null;

export function getClaudeService() {
    if (!claudeInstance) {
        claudeInstance = new ClaudeService();
    }
    return claudeInstance;
}

export function setupAIRoutes(app) {
    const claude = getClaudeService();

    // Chat endpoint
    app.post('/api/ai/chat', async (req, res) => {
        try {
            const { message, userId } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            const response = await claude.chat(message, userId || 'default');
            res.json(response);

        } catch (error) {
            console.error('AI Chat error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Analyze image endpoint
    app.post('/api/ai/analyze-image', async (req, res) => {
        try {
            const { image, question } = req.body;

            if (!image) {
                return res.status(400).json({ error: 'Image is required' });
            }

            const response = await claude.analyzeImage(image, question);
            res.json(response);

        } catch (error) {
            console.error('Image analysis error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Create plan endpoint
    app.post('/api/ai/plan', async (req, res) => {
        try {
            const { task } = req.body;

            if (!task) {
                return res.status(400).json({ error: 'Task is required' });
            }

            const steps = await claude.createPlan(task);
            res.json({ steps });

        } catch (error) {
            console.error('Plan creation error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Get AI stats
    app.get('/api/ai/stats', (req, res) => {
        res.json(claude.getStats());
    });

    // Clear context
    app.post('/api/ai/clear-context', (req, res) => {
        const { userId } = req.body;
        claude.clearContext(userId || 'default');
        res.json({ success: true });
    });

    // Bug Analyzer endpoints
    app.post('/api/ai/analyze-bug', async (req, res) => {
        try {
            const { error, code } = req.body;

            if (!error) {
                return res.status(400).json({ error: 'Error message is required' });
            }

            let prompt = `Você é um especialista em debugging. Analise este erro e forneça uma análise completa:

## 🐛 Erro Reportado:
${error}
`;

            if (code) {
                prompt += `
## 💻 Contexto do Código:
\`\`\`
${code}
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

            const response = await claude.chat(prompt, 'bug-analyzer');
            res.json(response);

        } catch (error) {
            console.error('Bug analysis error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Suggest fix endpoint
    app.post('/api/ai/suggest-fix', async (req, res) => {
        try {
            const { code, issue } = req.body;

            if (!code || !issue) {
                return res.status(400).json({ error: 'Code and issue are required' });
            }

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

            const response = await claude.chat(prompt, 'bug-fixer');
            res.json(response);

        } catch (error) {
            console.error('Fix suggestion error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Analyze stack trace endpoint
    app.post('/api/ai/analyze-stack', async (req, res) => {
        try {
            const { stackTrace } = req.body;

            if (!stackTrace) {
                return res.status(400).json({ error: 'Stack trace is required' });
            }

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

            const response = await claude.chat(prompt, 'stack-analyzer');
            res.json(response);

        } catch (error) {
            console.error('Stack trace analysis error:', error);
            res.status(500).json({ error: error.message });
        }
    });
}
