# ASI1:One Integration

Integração do **ASI:One AI** no Neobot como ferramenta auxiliar de reasoning e geração de imagens.

## 📋 Visão Geral

O ASI1AI Tool fornece acesso à API ASI:One da Fetch.ai, permitindo que agentes do Neobot utilizem capacidades avançadas de raciocínio e geração de imagens como **fallback** ou **especialização**.

### 🎯 Casos de Uso

1. **Fallback de Reasoning** - Quando o agente principal precisa de segunda opinião
2. **Tarefas Especializadas** - Problemas complexos que requerem raciocínio avançado
3. **Geração de Imagens** - Criar visuais para documentação, marketing ou apresentações
4. **Análise Profunda** - Questões que exigem processamento mais elaborado
5. **Brainstorming** - Gerar ideias criativas e explorar alternativas

## 🔧 Configuração

### 1. Obter API Key

1. Acesse [ASI1.ai](https://asi1.ai)
2. Crie uma conta ou faça login
3. Vá em Settings → API Keys
4. Gere uma nova chave

### 2. Configurar Ambiente

Adicione no arquivo `.env`:

```bash
ASI1AI_API_KEY=sk_your_api_key_here
```

### 3. Permissões do Arquivo

```bash
chmod 600 .env
```

## 🚀 Uso via Agent Tool

### Chat Completion (Reasoning)

```typescript
// Exemplo de chamada do tool
{
  action: "chat",
  prompt: "Explain quantum computing in simple terms",
  context: "You are teaching a high school student",
  model: "asi1-mini",
  temperature: 0.7,
  max_tokens: 2048
}
```

**Resposta**:
```json
{
  "success": true,
  "model": "asi1-mini",
  "content": "Quantum computing is...",
  "reasoning": "...",
  "usage": {
    "prompt_tokens": 35,
    "completion_tokens": 357,
    "total_tokens": 392
  },
  "finish_reason": "stop"
}
```

### Image Generation

```typescript
{
  action: "image",
  prompt: "A futuristic cryptocurrency payment interface with holographic elements",
  model: "asi1-mini",
  image_size: "1024x1024"
}
```

**Resposta**:
```json
{
  "success": true,
  "model": "asi1-mini",
  "prompt": "A futuristic cryptocurrency...",
  "size": "1024x1024",
  "image_url": "https://...",
  "total_images": 1,
  "message": "Image generated successfully"
}
```

## 📊 Modelos Disponíveis

| Modelo | Descrição | Uso Recomendado |
|--------|-----------|-----------------|
| `asi1-mini` | Rápido e eficiente | Uso geral, respostas rápidas |
| `asi1-plus` | Mais poderoso | Tarefas complexas, reasoning profundo |

## 🎨 Tamanhos de Imagem

- `512x512` - Rápido, protótipos
- `1024x1024` - Padrão, qualidade balanceada
- `1920x1080` - Alta qualidade (se disponível)

## 💡 Estratégias de Uso

### 1. Como Fallback

```typescript
// No prompt system do agente principal
"If you encounter a complex reasoning task or need a second opinion, 
use the asi1ai tool with action='chat' to get advanced analysis."
```

### 2. Especialização por Domínio

```typescript
// Para análise técnica profunda
{
  action: "chat",
  prompt: "Analyze the scalability implications of this architecture",
  context: "You are a senior system architect specializing in distributed systems",
  temperature: 0.3 // Mais determinístico
}
```

### 3. Geração Visual Automática

```typescript
// Gerar diagrama conceitual
{
  action: "image",
  prompt: "System architecture diagram showing microservices communication via message queue",
  image_size: "1024x1024"
}
```

## ⚙️ Parâmetros Avançados

### Temperature

- `0.0 - 0.3`: Respostas mais determinísticas e focadas
- `0.4 - 0.7`: Balanceado (padrão: 0.7)
- `0.8 - 1.0`: Mais criativo e variado

### Max Tokens

- `256`: Respostas curtas
- `1024`: Médias (maioria dos casos)
- `2048`: Longas (padrão)
- `4096`: Máximo (análises extensas)

## ⚡ Rate Limits (Plano Free)

**Token Limit**:

- 640,000 TPM (tokens por minuto)
- Extremamente generoso para uso normal

**Request Limit**:

- 3 RPM (requests por minuto)
- 500 RPD (requests por dia)

**Recomendações**:

- ✅ Espaçar chamadas em 20+ segundos para evitar limit
- ✅ Usar max_tokens apropriado para economizar
- ✅ Cache respostas repetidas
- ✅ Agrupar perguntas quando possível

## 🔒 Segurança

- ✅ API Key armazenada em `.env` com permissões 600
- ✅ Nunca commite a chave no git (`.env` no `.gitignore`)
- ✅ Rotação periódica de chaves recomendada
- ✅ Monitoramento de uso via dashboard ASI1.ai

## 📈 Monitoramento

Acesse o dashboard em [ASI1.ai](https://asi1.ai) para:

- Ver uso de tokens
- Monitorar custos
- Analisar performance
- Revogar/gerar novas chaves

## 🐛 Troubleshooting

### Erro: "ASI1AI_API_KEY not configured"

**Solução**: Adicione a chave no `.env` e reinicie o gateway.

### Erro: "401 Unauthorized"

**Solução**: Verifique se a API key está correta e ativa no dashboard.

### Erro: "Rate limit exceeded"

**Solução**: Aguarde alguns minutos ou faça upgrade do plano na ASI1.ai.

### Timeout na geração de imagem

**Solução**: Simplifique o prompt ou tente novamente após alguns segundos.

## 🔗 Recursos

- [Documentação Oficial ASI1.ai](https://docs.asi1.ai)
- [API Reference - Chat Completion](https://docs.asi1.ai/api-reference/llm/chat-completion)
- [API Reference - Image Generation](https://docs.asi1.ai/api-reference/llm/image-generation)
- [Agentverse.ai](https://agentverse.ai) - Ecosystem de agentes

## 📝 Exemplos Práticos

### Análise de Código

```typescript
{
  action: "chat",
  prompt: `Review this code for potential security issues:\n\n${codeSnippet}`,
  context: "You are a security-focused code reviewer",
  temperature: 0.3
}
```

### Geração de Conteúdo Marketing

```typescript
{
  action: "chat",
  prompt: "Write 3 engaging social media posts about our new crypto payment feature",
  context: "Target audience: tech-savvy entrepreneurs. Tone: professional but friendly",
  temperature: 0.8
}
```

### Diagrama Visual

```typescript
{
  action: "image",
  prompt: "Modern minimalist logo for a fintech startup called FlowPay, incorporating flow and payment concepts",
  image_size: "1024x1024"
}
```

## 🚦 Status

- ✅ Tool implementado
- ✅ Integrado no moltbot-tools
- ✅ Suporte a chat completion
- ✅ Suporte a image generation
- ✅ Documentação completa
- 📝 Pendente: Testes E2E
- 📝 Pendente: Métricas de uso

## 📅 Próximos Passos

1. Testar em cenários reais com agentes
2. Ajustar prompts system para uso otimizado
3. Implementar cache de respostas (opcional)
4. Adicionar rate limiting local (opcional)
5. Criar skill específico para tarefas comuns

---

**Última atualização**: 30 Jan 2026  
**Versão**: 1.0.0  
**Status**: ✅ Production Ready
