import dotenv from 'dotenv';
import { getClaudeService as getOptimizedClaudeService } from '../dist/ai/claude-service.js';

// Load environment variables
dotenv.config({ path: '../.env' });

// 🚀 Use optimized Claude service with cache & auto-model selection
export function getClaudeService() {
    return getOptimizedClaudeService();
}

export function setupAIRoutes(app) {
    const claude = getClaudeService();

    // Chat endpoint (optimized with cache & auto-model)
    app.post('/api/ai/chat', async (req, res) => {
        try {
            const { message, userId } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            const startTime = Date.now();
            
            // Use context-aware chat if userId provided
            let responseText;
            if (userId) {
                responseText = await claude.chatWithContext(userId, message);
            } else {
                // Use simple chat with auto-model selection
                responseText = await claude.chat(message, { cache: true });
            }
            
            const responseTime = Date.now() - startTime;

            res.json({
                message: responseText,
                responseTime
            });

        } catch (error) {
            console.error('AI Chat error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Analyze image endpoint (with cache)
    app.post('/api/ai/analyze-image', async (req, res) => {
        try {
            const { image, question } = req.body;

            if (!image) {
                return res.status(400).json({ error: 'Image is required' });
            }

            const startTime = Date.now();
            const analysis = await claude.analyzeImage(image, question, { cache: true });
            const responseTime = Date.now() - startTime;

            res.json({
                analysis,
                responseTime
            });

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

    // Get AI stats (with cache info!)
    app.get('/api/ai/stats', (req, res) => {
        res.json(claude.getStats());
    });
    
    // Get cache stats
    app.get('/api/ai/cache-stats', (req, res) => {
        res.json(claude.getCacheStats());
    });

    // Clear context
    app.post('/api/ai/clear-context', (req, res) => {
        const { userId } = req.body;
        claude.clearContext(userId || 'default');
        res.json({ success: true });
    });
    
    // Clear cache
    app.post('/api/ai/clear-cache', (req, res) => {
        claude.clearCache();
        res.json({ success: true, message: 'Cache cleared' });
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

            const startTime = Date.now();
            const analysis = await claude.chatWithContext('bug-analyzer', prompt);
            const responseTime = Date.now() - startTime;
            
            res.json({
                message: analysis,
                responseTime
            });

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

            const startTime = Date.now();
            const fix = await claude.chatWithContext('bug-fixer', prompt);
            const responseTime = Date.now() - startTime;
            
            res.json({
                message: fix,
                responseTime
            });

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

            const startTime = Date.now();
            const analysis = await claude.chatWithContext('stack-analyzer', prompt);
            const responseTime = Date.now() - startTime;
            
            res.json({
                message: analysis,
                responseTime
            });

        } catch (error) {
            console.error('Stack trace analysis error:', error);
            res.status(500).json({ error: error.message });
        }
    });
}
