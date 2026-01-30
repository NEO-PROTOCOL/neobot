# 🎯 ASI1.AI Configuration - COMPLETE

**Status:** ✅ PRODUÇÃO ATIVA  
**Date:** 30 Jan 2026  
**Gateway:** Running (PID 42395)

---

## 📋 CONFIGURAÇÃO FINAL

### Primary LLM: ASI1.AI
```json
{
  "model": "asi1-mini",
  "context": "16K tokens",
  "cost": "$0.05/1M tokens",
  "provider": "asi1.ai",
  "api_url": "https://api.asi1.ai/v1"
}
```

### Fallback LLM: Claude Opus 4.5
```json
{
  "model": "claude-opus-4-5",
  "provider": "anthropic",
  "trigger": "if ASI1.AI fails"
}
```

---

## 🔧 ARQUIVOS DE CONFIGURAÇÃO

### 1. `~/.clawdbot/moltbot.json`
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai-compatible/asi1-mini"
      }
    }
  },
  "env": {
    "OPENAI_API_KEY": "$ASI1AI_API_KEY",
    "OPENAI_BASE_URL": "https://api.asi1.ai/v1"
  }
}
```

### 2. `scripts/load-secrets-bitwarden.sh`
```bash
export ASI1AI_API_KEY=$(get_secret "ASI1AI_API_KEY")
export ANTHROPIC_API_KEY=$(get_secret "ANTHROPIC_API_KEY")
```

### 3. `scripts/start-gateway-with-secrets.sh`
```bash
export ASI1AI_API_KEY=$(get_secret "ASI1AI_API_KEY")
export ANTHROPIC_API_KEY=$(get_secret "ANTHROPIC_API_KEY")
export CLAWDBOT_GATEWAY_TOKEN=neobot
pnpm moltbot gateway --port 18789
```

---

## 🧠 SKILL EXISTENTE

**Location:** `skills/llm/asi1/`

```typescript
// skills/llm/asi1/config.ts
export const ASI1_CONFIG = {
  apiKey: process.env.ASI1AI_API_KEY || '',
  baseURL: 'https://api.asi1.ai/v1',
  models: {
    preview: 'asi1-preview', // 128K context, $0.15/1M
    turbo: 'asi1-turbo',     // 32K context, $0.10/1M
    mini: 'asi1-mini',       // 16K context, $0.05/1M ✅
  },
  defaults: {
    model: 'asi1-preview',
    temperature: 0.7,
    maxTokens: 2000,
  }
};
```

**Docs:** https://docs.asi1.ai/documentation/getting-started/quickstart

---

## 💰 CUSTOS ESTIMADOS (Tráfego Pago)

### Cenário 1: 100 conversas/dia
```
100 conversas × 2K tokens/conversa = 200K tokens/dia
200K tokens × $0.05/1M = $0.01/dia = $0.30/mês
```

### Cenário 2: 500 conversas/dia
```
500 conversas × 2K tokens/conversa = 1M tokens/dia
1M tokens × $0.05/1M = $0.05/dia = $1.50/mês
```

### Cenário 3: 1000 conversas/dia (HIGH)
```
1000 conversas × 2K tokens/conversa = 2M tokens/dia
2M tokens × $0.05/1M = $0.10/dia = $3.00/mês
```

**Conclusão:** ULTRA BARATO para tráfego pago! 🎉

---

## 🚀 START GATEWAY (Script Rápido)

```bash
# Start com todos os secrets
./scripts/start-gateway-with-secrets.sh

# Ou manual:
cd /Users/nettomello/CODIGOS/neobot
source ~/.nvm/nvm.sh && nvm use 22
export BW_SESSION="YOUR_SESSION"
export ASI1AI_API_KEY=$(bw get item "ASI1AI_API_KEY" --session "$BW_SESSION" | jq -r '.notes')
export ANTHROPIC_API_KEY=$(bw get item "ANTHROPIC_API_KEY" --session "$BW_SESSION" | jq -r '.notes')
export CLAWDBOT_GATEWAY_TOKEN=neobot
pnpm moltbot gateway --port 18789
```

---

## ✅ VERIFICAÇÃO RÁPIDA

```bash
# Check gateway health
CLAWDBOT_GATEWAY_TOKEN=neobot pnpm moltbot health

# Expected output:
# WhatsApp: linked (auth age Xm)
# Telegram: ok (@AgenteFlow_Bot)
# Agents: main (default)
```

---

## 🔐 SECRETS NO BITWARDEN

```
✅ ASI1AI_API_KEY       → Primary LLM
✅ ANTHROPIC_API_KEY    → Fallback LLM
✅ TELEGRAM_BOT_TOKEN   → Notifications
✅ TELEGRAM_CHAT_ID     → Alerts
```

---

## 📊 MONITORAMENTO

### Logs do Gateway
```bash
# Tail logs in real-time
tail -f ~/.cursor/projects/*/terminals/[PID].txt
```

### Check API Usage
- **ASI1.AI Dashboard:** https://asi1.ai/dashboard
- **Anthropic Dashboard:** https://console.anthropic.com

---

## 🎯 PRÓXIMOS PASSOS

- [ ] Ativar tráfego pago ✅ AGORA
- [ ] Adicionar blocklist família (aguardando lista)
- [ ] Monitorar primeiras conversões
- [ ] Ajustar system prompt se necessário
- [ ] Escalar tráfego baseado em métricas

---

## 📖 REFERÊNCIAS

- **ASI1.AI Docs:** https://docs.asi1.ai
- **API Reference:** https://docs.asi1.ai/api-reference/llm/chat-completion
- **Quickstart:** https://docs.asi1.ai/documentation/getting-started/quickstart
- **Model Selection:** https://docs.asi1.ai/documentation/getting-started/model-selection
- **OpenAI Compatibility:** https://docs.asi1.ai/documentation/build-with-asi-one/openai-compatibility

---

## ⚠️ IMPORTANTE: BLOCKLIST FAMÍLIA

**Status:** AGUARDANDO LISTA

**Como funciona:**
1. Você fornece lista de números (+5562...)
2. Adicionamos ao system prompt em `AGENTS_FLOWOFF_SALES.md`
3. LLM ignora esses números completamente
4. Responde apenas: "Oi! 👋" (sem ativar vendas)

**Formato esperado:**
```
+5562983231110  # Você
+5562XXXXXXXX   # Esposa
+5562XXXXXXXX   # Mãe
+5562XXXXXXXX   # Pai
...
```

**Aguardando lista para implementar!** 👨‍👩‍👧‍👦

---

**Status:** Sistema 100% operacional para tráfego pago! 🚀
