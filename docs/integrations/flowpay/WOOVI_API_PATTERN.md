# 🎯 Woovi API - Padrão de Autenticação

**Data:** 30 Janeiro 2026  
**Fonte:** Repositório oficial FlowPay + FLOWPAY_WOOVI.md

---

## ⚠️ REGRA DE OURO - Autenticação Woovi

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CRÍTICO: A API Woovi NÃO usa prefixo "Bearer"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ERRADO:  Authorization: Bearer Q2xp...
✅ CORRETO: Authorization: Q2xp...

A chave vai DIRETAMENTE no header, sem prefixo!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📐 Arquitetura do Neobot

```
┌─────────────────┐
│  Neobot Local   │
│  flowpay-tool   │
└────────┬────────┘
         │ POST /api/create-charge
         │ (sem Authorization header)
         ▼
┌─────────────────┐
│ Railway Backend │ ← AQUI está a autenticação Woovi
│  FlowPay API    │
└────────┬────────┘
         │ POST /api/v1/charge
         │ Authorization: [API_KEY]  ← SEM "Bearer"
         ▼
┌─────────────────┐
│   Woovi API     │
│ api.woovi.com   │
└─────────────────┘
```

**Importante:**

- O **Neobot** não faz chamadas diretas para Woovi
- O **Railway Backend** é quem implementa a autenticação correta
- O padrão correto já foi aplicado no repositório oficial FlowPay

---

## 🔧 Implementação Correta (Backend Railway)

### ❌ Errado (padrão típico REST)

```javascript
const response = await fetch('https://api.woovi.com/api/v1/charge', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${WOOVI_API_KEY}`,  // ❌ NÃO funciona!
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(pixData)
});
```

### ✅ Correto (padrão Woovi)

```javascript
const response = await fetch('https://api.woovi.com/api/v1/charge', {
  method: 'POST',
  headers: {
    'Authorization': cleanApiKey,  // ✅ SEM "Bearer"
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(pixData)
});
```

**Exemplo real:**
```javascript
// Limpar a chave (remover espaços, Bearer se houver)
const cleanApiKey = WOOVI_API_KEY.trim().replace(/^Bearer\s+/i, '');

// Usar diretamente
headers: {
  'Authorization': cleanApiKey
}
```

---

## 🧪 Como Testar

### 1. Teste Direto na Woovi API

```bash
# ✅ Correto
curl -I -H "Authorization: $WOOVI_API_KEY" \
  "https://api.woovi.com/api/v1/charge?limit=1"

# Esperado: HTTP 200 OK
```

```bash
# ❌ Errado (vai falhar)
curl -I -H "Authorization: Bearer $WOOVI_API_KEY" \
  "https://api.woovi.com/api/v1/charge?limit=1"

# Esperado: HTTP 401 Unauthorized
```

### 2. Teste via Railway Backend

```bash
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

**✅ Se correto:**
```json
{
  "success": true,
  "pix_data": {
    "qr_code": "https://api.woovi.com/qr/v1/...",
    "br_code": "00020126...",
    "value": 1.00,
    "status": "pending"
  }
}
```

**❌ Se errado (Bearer usado):**
```json
{
  "success": false,
  "error": "Erro de autenticação na API",
  "type": "EXTERNAL_API_ERROR"
}
```

---

## 🛡️ Segurança do Webhook

A Woovi também envia webhooks **sem** prefixo "Bearer":

```javascript
// Webhook recebido da Woovi
headers: {
  'Authorization': 'your_webhook_secret_XXXXX',  // SEM "Bearer"
  'Content-Type': 'application/json'
}

// Validação no backend
const receivedAuth = req.headers.authorization;
const expectedAuth = process.env.WOOVI_WEBHOOK_SECRET;

if (receivedAuth !== expectedAuth) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Camadas de segurança:**

```text
┌─────────────────────────────────────┐
│ [A] IP Whitelist                    │
│     179.190.27.5, 179.190.27.6,     │
│     186.224.205.214                  │
├─────────────────────────────────────┤
│ [B] Authorization Header            │
│     WOOVI_WEBHOOK_SECRET (sem Bearer)│
├─────────────────────────────────────┤
│ [C] HMAC Signature                  │
│     Hash com webhook secret         │
└─────────────────────────────────────┘
```

---

## 📚 Variáveis de Ambiente

### Local (Neobot .env)

```bash
# Neobot não chama Woovi diretamente
# Apenas precisa da URL do backend Railway
FLOWPAY_API_URL=https://flowpay-production-10d8.up.railway.app
```

### Railway Backend

```bash
# Backend Railway precisa destas 3 variáveis
WOOVI_API_KEY=Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==

WOOVI_WEBHOOK_SECRET=your_webhook_secret_XXXXX  # Sem prefixo openpix_

TOKEN_SECRET=6efddab08745069cd6157087ef8a3b01c6343dd3da7754b311180045b8855423...
```

---

## 🚨 Troubleshooting

### Erro: "Erro de autenticação na API"

**Causa:** Backend Railway está usando `Bearer` no header.

**Solução:**
1. Verificar código do backend Railway
2. Confirmar que está usando:
   ```javascript
   headers: { 'Authorization': cleanApiKey }  // SEM "Bearer"
   ```
3. Re-deploy do backend

### Erro: "Unauthorized" (401)

**Causa:** Chave API incorreta ou com espaços.

**Solução:**
1. Verificar `WOOVI_API_KEY` no Railway
2. Remover espaços: `cleanApiKey = key.trim()`
3. Confirmar formato Base64 correto

### Erro: Webhook não recebe eventos

**Causa:** IP não está na whitelist ou Authorization header incorreto.

**Solução:**
1. Verificar IPs permitidos no código
2. Confirmar que webhook recebe header sem "Bearer"
3. Validar HMAC signature

---

## 🔗 Referências

- **Fonte oficial:** `docs/integrations/flowpay/FLOWPAY_WOOVI.md`
- **Repositório FlowPay:** Padrão já corrigido
- **Woovi Docs:** https://developers.woovi.com/api
- **Neobot Tool:** `src/agents/tools/flowpay-tool.ts`

---

## ✅ Checklist de Implementação

### Backend Railway
- [ ] Remover `Bearer` do Authorization header
- [ ] Limpar API key (trim, remove Bearer se houver)
- [ ] Usar chave diretamente: `Authorization: [API_KEY]`
- [ ] Testar com curl direto na Woovi API
- [ ] Validar webhook sem Bearer
- [ ] Implementar HMAC signature
- [ ] IP whitelist configurado

### Neobot
- [ ] flowpay-tool aponta para Railway correto
- [ ] FLOWPAY_API_URL configurada
- [ ] Documentação atualizada
- [ ] Testes E2E passando

---

**Status:** ✅ Padrão documentado  
**Aplicado em:** Repositório oficial FlowPay (Railway)  
**Neobot:** Apenas consome o backend (não precisa mudar)  
**Última atualização:** 30/01/2026 22:15
