# 🧠 ASI1 LLM Provider Integration

**Versão:** 1.0.0  
**Status:** 🟡 Em Desenvolvimento  
**Docs:** https://docs.asi1.ai

---

## 📖 Descrição

Integração com ASI1 LLM Provider para uso no NEØ Protocol. ASI1 é um provedor LLM alternativo ao Anthropic/OpenAI, com modelos próprios e pricing competitivo.

---

## 🎯 Casos de Uso

### 1. Chat Completion
```bash
pnpm moltbot llm asi1 chat "Explain quantum computing"
```

### 2. Streaming Response
```bash
pnpm moltbot llm asi1 chat "Write a story" --stream
```

### 3. Compare com Claude
```bash
pnpm moltbot llm compare "Explain AI" --providers asi1,claude
```

---

## 🚀 Setup

### API Key

Já configurado em `.env`:
```bash
ASI1AI_API_KEY=[REDACTED]
```

### Endpoint

```
Base URL: https://api.asi1.ai/v1
Chat: /chat/completions
```

---

## 📋 Modelos Disponíveis

| Modelo | Contexto | Uso | Preço |
|--------|----------|-----|-------|
| `asi1-preview` | 128K | General purpose | $0.15/1M tokens |
| `asi1-turbo` | 32K | Fast responses | $0.10/1M tokens |
| `asi1-mini` | 16K | Simple tasks | $0.05/1M tokens |

---

## 🔧 Arquitetura

```
skills/llm/asi1/
├── SKILL.md            # Esta documentação
├── chat.ts             # Chat completion ✅
├── config.ts           # ASI1 config ✅
└── stream.ts           # Streaming (future)

Note: client.ts não necessário - chat.ts
usa fetch direto (arquitetura simples)
```

### API Request Format

```typescript
{
  model: "asi1-preview",
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "Hello!" }
  ],
  temperature: 0.7,
  max_tokens: 1000,
  stream: false
}
```

### API Response Format

```typescript
{
  id: "chatcmpl-123",
  object: "chat.completion",
  created: 1706123456,
  model: "asi1-preview",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "Hello! How can I help you?"
      },
      finish_reason: "stop"
    }
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 8,
    total_tokens: 18
  }
}
```

---

## 🔗 Integrações

### neo-agent-full
- ASI1 como provider alternativo
- LangChain ASI1 adapter
- Fallback quando Claude/Gemini falham

### Neobot
- Skills com ASI1
- Chat via Telegram/WhatsApp
- Automações inteligentes

---

## 📊 Exemplos de Uso

### Exemplo 1: Simple Chat
```bash
pnpm moltbot llm asi1 chat "What is NEØ Protocol?"
# Output:
# 🤖 ASI1 Response:
# NEØ Protocol is a multi-agent coordination system
# designed for autonomous AI agents...
```

### Exemplo 2: System Prompt
```bash
pnpm moltbot llm asi1 chat "Analyze this code" \
  --system "You are a TypeScript expert" \
  --file ./code.ts
# Output:
# 🤖 Code Analysis:
# This TypeScript code implements...
```

### Exemplo 3: Streaming
```bash
pnpm moltbot llm asi1 chat "Write a poem" --stream
# Output (real-time):
# 🤖 ASI1 (streaming):
# In the digital realm...
# Where silicon minds...
# ✅ Stream complete
```

---

## 🔐 Segurança

### API Key
- Armazenada em `.env` (não commitada)
- Rotação recomendada a cada 90 dias

### Rate Limiting
- ASI1: 100 req/min (padrão)
- Implementar retry com backoff

### Error Handling
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: ASI1 server error

---

## 📈 Roadmap

### v1.0 (Esta Semana)

- [x] Documentação ✅
- [x] Implementar config.ts ✅
- [x] Implementar chat.ts ✅
- [ ] Testar API key (pending)
- [ ] Comparar com Claude/Gemini (pending)

**Note:** `client.ts` não implementado -
chat.ts usa fetch direto (arquitetura
mais simples, sem dependências extras)

### v1.1 (Próximas 2 Semanas)

- [ ] Streaming support
- [ ] LangChain integration
- [ ] Usage tracking
- [ ] Cost comparison dashboard

### v2.0 (Futuro)

- [ ] Fine-tuned models
- [ ] Function calling
- [ ] Multi-modal (images)
- [ ] ASI1 embeddings

---

## 🐛 Troubleshooting

### API Key inválida

```bash
# Testar key
curl -X POST https://api.asi1.ai/v1/chat/completions \
  -H "Authorization: Bearer $ASI1AI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"asi1-preview","messages":[{"role":"user","content":"test"}]}'
```

### Timeout

- Aumentar timeout para 30s
- ASI1 pode ser mais lento que Claude

### 404 Not Found

- Verificar endpoint correto: `/v1/chat/completions`
- Não usar `/v1/completions` (legacy)

---

## 🔗 Links Úteis

- **ASI1 Docs:** https://docs.asi1.ai
- **API Reference:** https://docs.asi1.ai/api-reference/llm/chat-completion
- **Quickstart:** https://docs.asi1.ai/documentation/getting-started/quickstart
- **Pricing:** https://asi1.ai/pricing

---

**Última Atualização:** 01 Fevereiro 2026  
**Status:** 🟡 Implementado - Aguardando testes

**Implementado:**
- ✅ config.ts (configurações e API key)
- ✅ chat.ts (CLI completo com options)

**Pendente:**
- ⏳ Testar com API key real
- ⏳ Comparação de performance vs Claude/Gemini
