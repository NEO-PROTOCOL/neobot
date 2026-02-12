# 🚂 Railway Re-deploy Guide · FlowPay

**Atualizado:** 30 Janeiro 2026  
**Status:** Variáveis adicionadas, aguardando re-deploy

---

## 🎯 Situação Atual

✅ **Variáveis configuradas no Railway:**

- `WOOVI_API_KEY` ✅
- `WOOVI_WEBHOOK_SECRET` ✅
- `TOKEN_SECRET` ✅ (equivalente ao JWT_SECRET)

❌ **Problema:** Backend não carregou as variáveis (precisa re-deploy)

```bash
# Teste atual retorna:
{
  "success": false,
  "error": "Erro de autenticação na API. Verifique suas credenciais.",
  "type": "EXTERNAL_API_ERROR"
}
```

---

## 🔄 Como Fazer Re-deploy no Railway

### Opção 1: Via Dashboard (Mais Fácil)

1. Acesse: <https://railway.app>
2. Selecione o projeto **FlowPay**
3. Vá em **Deployments**
4. Clique em **"Deploy"** ou **"Redeploy"**
5. Aguarde 2-3 minutos
6. Verifique logs para confirmar sucesso

### Opção 2: Via CLI

```bash
# Instalar Railway CLI (se não tiver)
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Trigger re-deploy
railway up
```

### Opção 3: Push no GitHub (Se conectado)

```bash
# Qualquer push vai triggerar deploy
git commit --allow-empty -m "chore: trigger railway redeploy"
git push origin main
```

---

## ✅ Verificação Após Re-deploy

### 1. Verificar Logs

```bash
# No Railway Dashboard
Deployments → Latest → View Logs

# Procure por:
✅ "Server started on port..."
✅ "Environment variables loaded"
❌ "Missing WOOVI_API_KEY" (se aparecer, variável não foi carregada)
```

### 2. Testar Health Check

```bash
curl https://flowpay-production-10d8.up.railway.app/health

# Esperado:
{
  "status": "ok",
  "timestamp": "2026-01-30T21:30:00.000Z"
}
```

### 3. Testar Create Charge

```bash
cd /Users/nettomello/CODIGOS/neobot

curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x0000000000000000000000000000000000000000",
    "valor": 1.00,
    "moeda": "BRL",
    "id_transacao": "test-'$(date +%s)'",
    "product_id": "neobot-test"
  }'
```

**Resultado esperado ANTES do re-deploy:**
```json
{
  "success": false,
  "error": "Erro de autenticação na API. Verifique suas credenciais."
}
```

**Resultado esperado DEPOIS do re-deploy:**
```json
{
  "success": true,
  "pix_data": {
    "qr_code": "https://api.woovi.com/qr/v1/...",
    "br_code": "00020126...",
    "correlation_id": "...",
    "value": 1.00,
    "expires_at": "2026-01-31T21:30:00.000Z",
    "status": "pending"
  }
}
```

---

## 📋 Checklist de Variáveis

Confirme que estas variáveis estão no Railway:

### Variables Tab (Railway Dashboard)

```bash
# Nome exato (case-sensitive)
WOOVI_API_KEY = Q2xpZW50X0lkX1hYWF.....A==

WOOVI_WEBHOOK_SECRET = openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

TOKEN_SECRET = your_random_secret_min_64_chars_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### ⚠️ Nomenclatura Importante

| Neobot Local | Railway Backend | Woovi API |
|--------------|-----------------|-----------|
| `TOKEN_SECRET` | `TOKEN_SECRET` ✅ | - |
| `FLOWPAY_JWT_SECRET` | (fallback) | - |
| `WOOVI_API_KEY` | `WOOVI_API_KEY` ✅ | Usa este |
| `WOOVI_WEBHOOK_SECRET` | `WOOVI_WEBHOOK_SECRET` ✅ | Valida HMAC |

**Nota:** O código foi atualizado para aceitar ambos `TOKEN_SECRET` (Railway) e `FLOWPAY_JWT_SECRET` (legacy).

---

## 🧪 Teste Automatizado

Use o script de teste completo:

```bash
cd /Users/nettomello/CODIGOS/neobot

./scripts/flowpay/test-integration.sh
```

**Output esperado após re-deploy:**

```
==========================================
FlowPay Integration Test Suite
==========================================

✅ Local environment variables OK
✅ Railway service UP (200 OK)
✅ Create charge: SUCCESS

PIX QR Code: https://api.woovi.com/qr/v1/...
BR Code: 00020126...
Correlation ID: ...
Value: R$ 1.00
Status: pending

==========================================
✅ ALL TESTS PASSED
==========================================
```

---

## 🚨 Troubleshooting

### Problema: Ainda dá erro de autenticação após re-deploy

**Causa possível:**
1. Variáveis com nome errado (typo)
2. Espaços extras no valor
3. Variável não foi salva

**Solução:**
1. Vá em Railway → Variables
2. Delete as 3 variáveis
3. Adicione novamente (copie exatamente dos exemplos acima)
4. Clique em "Deploy" novamente

### Problema: Deploy falhou

**Causa possível:**
1. Erro no código backend
2. Falta de memória/recursos

**Solução:**
1. Verifique os logs de build
2. Procure por "ERROR" ou "FAILED"
3. Se for erro de memória, upgrade o plano Railway

### Problema: Deploy bem-sucedido mas ainda não funciona

**Causa possível:**
1. Serviço não reiniciou completamente
2. Cache do Railway

**Solução:**
1. Force restart: Settings → Restart Service
2. Aguarde 2-3 minutos
3. Teste novamente

---

## 📊 Arquitetura Após Re-deploy

```
┌─────────────────┐
│  Neobot Local   │
│  TOKEN_SECRET=  │ ← .env atualizado ✅
│  (fallback:     │
│   FLOWPAY_JWT_  │
│   SECRET)       │
└────────┬────────┘
         │ POST /api/create-charge
         ▼
┌─────────────────┐
│ Railway Backend │
│  TOKEN_SECRET=  │ ← Variável adicionada ✅
│  WOOVI_API_KEY= │ ← Variável adicionada ✅
│  WOOVI_WEBHOOK_ │ ← Variável adicionada ✅
│  SECRET=        │
└────────┬────────┘
         │ Aguardando re-deploy ⏳
         ▼
┌─────────────────┐
│   Woovi API     │
│ api.woovi.com   │ ← Ativo ✅
└────────┬────────┘
         │ Webhook
         ▼
┌─────────────────┐
│Netlify Webhook  │
│  Handler        │ ← A verificar 🔜
└─────────────────┘
```

---

## ⏱️ Próximos Passos (Pós Re-deploy)

### Imediato (5 min)

1. ✅ Re-deploy Railway
2. ✅ Testar create-charge
3. ✅ Verificar logs

### Curto Prazo (30 min)

1. [ ] Configurar Netlify webhook
2. [ ] Testar webhook E2E
3. [ ] Configurar Woovi dashboard

### Médio Prazo (1-2h)

1. [ ] Integrar Plugin Widget
2. [ ] Testes com PIX real (R$ 1,00)
3. [ ] Documentar fluxo completo

---

## 📚 Referências

- [Railway Docs - Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Docs - Deployments](https://docs.railway.app/deploy/deployments)
- [ENV Variables Guide](/docs/integrations/flowpay/ENV_VARIABLES_GUIDE.md)
- [Woovi Official Setup](/docs/integrations/flowpay/WOOVI_OFFICIAL_SETUP.md)

---

**Status:** 🟡 **AGUARDANDO RE-DEPLOY**  
**Última verificação:** 30/01/2026 21:30  
**Próxima ação:** Re-deploy no Railway Dashboard
