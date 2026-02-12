# FlowPay + Woovi - Configuração Oficial

Guia baseado na documentação oficial da Woovi para integração completa do FlowPay.

**Referências Oficiais**:
- 📚 Docs: https://developers.woovi.com/api
- 🔧 GitHub: https://github.com/woovibr/woovi-developers
- 🌐 Webhook: https://flowpaypix.netlify.app/.netlify/functions/webhook-handler

---

## 🏗️ Arquitetura Atual

```
┌─────────────────────────────────────────────────────────┐
│                    NEOBOT (Local)                       │
│  - Agente Moltbot com FlowPay tool                     │
│  - CLI: pnpm moltbot skill flowpay/buy                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│          FLOWPAY API (Railway - Backend)                │
│  URL: flowpay-production-10d8.up.railway.app           │
│  - Recebe requests do Neobot                           │
│  - Chama API Woovi para criar PIX                      │
│  - Retorna QR code e br_code                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────────────────────┐
│               WOOVI API (api.woovi.com)                 │
│  - Processa pagamento PIX                              │
│  - Gera QR Code dinâmico                               │
│  - Monitora pagamento                                  │
└────────────────┬────────────────────────────────────────┘
                 │ (quando pago)
                 v
┌─────────────────────────────────────────────────────────┐
│      WEBHOOK HANDLER (Netlify - flowpaypix)            │
│  URL: flowpaypix.netlify.app/.netlify/functions/       │
│       webhook-handler                                  │
│  - Recebe notificação de pagamento da Woovi           │
│  - Valida HMAC signature                              │
│  - Dispara ações de desbloqueio                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Variáveis de Ambiente Necessárias

### 1. Neobot (Local `.env`)

```bash
# FlowPay API
FLOWPAY_API_URL=https://flowpay-production-10d8.up.railway.app

# Woovi/OpenPix Keys (mesma chave)
FLOWPAY_API_KEY=<sua-chave-woovi-base64>
WOOVI_API_KEY=<sua-chave-woovi-base64>
OPENPIX_API_KEY=<sua-chave-woovi-base64>

# Secrets
FLOWPAY_JWT_SECRET=<seu-jwt-secret-128-chars>
FLOWPAY_SIGNATURE_SECRET=<woovi-hmac-secret>
WOOVI_WEBHOOK_SECRET=<woovi-hmac-secret>
```

### 2. Railway (FlowPay Backend)

```bash
# No Railway Dashboard → Variables
WOOVI_API_KEY=<sua-chave-woovi-base64>
WOOVI_WEBHOOK_SECRET=<woovi-hmac-secret>
JWT_SECRET=<mesmo-valor-do-neobot>
```

### 3. Netlify (Webhook Handler)

```bash
# No Netlify Dashboard → Environment Variables
WOOVI_WEBHOOK_SECRET=<woovi-hmac-secret>
JWT_SECRET=<mesmo-valor-dos-outros>
FLOWPAY_API_URL=https://flowpay-production-10d8.up.railway.app
```

---

## 📋 Onde Obter as Chaves

### 1. Woovi API Key (Base64)

1. Acesse: https://app.woovi.com
2. Login com sua conta
3. Navegue: **API** → **Production Keys**
4. Copie: **Client ID** e **Client Secret**
5. A chave está em formato Base64 (ex: `Q2xpZW50X0lkXzk2MDRkYTJm...`)

**Importante**: Esta é uma chave combinada (ID:Secret em Base64)

### 2. HMAC Webhook Secret

1. No dashboard Woovi: https://app.woovi.com
2. Navegue: **Webhooks** → **Settings**
3. Copie o **Webhook Secret** (formato: `openpix_...`)
4. Este secret valida a autenticidade dos webhooks

**Importante**: Use o MESMO valor em todos os lugares:
- `WOOVI_WEBHOOK_SECRET`
- `FLOWPAY_SIGNATURE_SECRET`

### 3. JWT Secret (Auto-gerado)

```bash
# Gerar um secret forte de 128 caracteres
openssl rand -hex 64

# Ou via Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Importante**: Use o MESMO valor em:
- Neobot `.env`: `FLOWPAY_JWT_SECRET`
- Railway: `JWT_SECRET`
- Netlify: `JWT_SECRET`

---

## 🔗 Configurar Webhook na Woovi

### 1. Acessar Dashboard

https://app.woovi.com → **Webhooks** → **Add Webhook**

### 2. Configurar URL

```
URL: https://flowpaypix.netlify.app/.netlify/functions/webhook-handler
Método: POST
Eventos: charge.completed, charge.expired
```

### 3. Testar Webhook

No dashboard Woovi:
1. Clique em **Test Webhook**
2. Verifique se a resposta é `200 OK`
3. Verifique logs no Netlify Functions

---

## 🧪 Teste Completo E2E

### Passo 1: Criar Cobrança (via Neobot)

```bash
cd /Users/nettomello/CODIGOS/neobot

# Via skill
pnpm moltbot skill flowpay/buy \
  --amount 1.00 \
  --product "test-product" \
  --customer "test@example.com"

# Ou via agent tool (WhatsApp/Telegram)
# "Crie uma cobrança de R$ 1,00 para teste"
```

**Resultado esperado**:
```json
{
  "success": true,
  "charge_id": "flowoff-start-1738264800000-abc123",
  "pix_code": "00020126...",
  "qr_code_url": "https://...",
  "expires_at": "2026-01-30T..."
}
```

### Passo 2: Pagar PIX

1. Abra seu app de banco
2. Vá em **PIX** → **Ler QR Code** ou **Copia e Cola**
3. Escaneie o QR ou cole o código PIX
4. Confirme pagamento de R$ 1,00

### Passo 3: Verificar Webhook

**Verificar no Netlify**:
1. Acesse: https://app.netlify.com
2. Site: **flowpaypix**
3. Functions → **webhook-handler**
4. Ver logs recentes (deve mostrar request da Woovi)

**Verificar via código**:
```bash
# Checar status via skill
pnpm moltbot skill flowpay/status \
  --charge_id "flowoff-start-1738264800000-abc123"
```

**Resultado esperado**:
```json
{
  "success": true,
  "charge_id": "flowoff-start-1738264800000-abc123",
  "status": "completed",
  "paid": true,
  "message": "✅ Payment confirmed!"
}
```

---

## 📊 Validação de HMAC (Segurança)

### Como a Woovi Assina Webhooks

Segundo a documentação oficial (https://developers.woovi.com/api):

```typescript
// Woovi envia no header
const signature = req.headers['x-openpix-signature']; // ou 'x-webhook-signature'

// Validar
const crypto = require('crypto');
const secret = process.env.WOOVI_WEBHOOK_SECRET;
const body = JSON.stringify(req.body);

const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid webhook signature');
}
```

### No Webhook Handler (Netlify)

O código deve validar assim:

```typescript
// netlify/functions/webhook-handler.ts
export async function handler(event: any) {
  const signature = event.headers['x-openpix-signature'];
  const secret = process.env.WOOVI_WEBHOOK_SECRET;
  
  // Validar HMAC
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(event.body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }
  
  // Processar pagamento confirmado
  const payload = JSON.parse(event.body);
  
  if (payload.event === 'charge.completed') {
    // Liberar acesso ao produto
    await unlockProduct(payload.charge);
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
}
```

---

## 🔍 Debugging

### Logs do Railway (FlowPay API)

```bash
# Via Railway CLI
railway logs

# Ou no dashboard
# railway.app → flowpay → Deployments → View logs
```

**Procurar por**:
- ✅ `Creating charge...`
- ✅ `Woovi API response: 200`
- ❌ `Woovi API error: 401` (problema de auth)
- ❌ `WOOVI_API_KEY not configured`

### Logs do Netlify (Webhook Handler)

```bash
# No Netlify dashboard
# app.netlify.com → flowpaypix → Functions → webhook-handler
```

**Procurar por**:
- ✅ `Webhook received from Woovi`
- ✅ `Signature validated`
- ✅ `Charge completed: xxx`
- ❌ `Invalid signature` (HMAC incorreto)
- ❌ `WOOVI_WEBHOOK_SECRET not found`

### Verificar Variáveis

```bash
# Local (Neobot)
cat .env | grep -E "WOOVI|FLOWPAY"

# Railway (via CLI)
railway variables

# Netlify (via CLI)
netlify env:list
```

---

## 📖 Documentação Oficial Woovi

### API Reference

**Base URL**: `https://api.woovi.com`

**Endpoints principais**:

1. **Criar Cobrança PIX**
   ```
   POST /api/v1/charge
   Headers:
     Authorization: <WOOVI_API_KEY>
     Content-Type: application/json
   Body:
     {
       "value": 100,
       "correlationID": "unique-id-123",
       "comment": "Produto X"
     }
   ```

2. **Consultar Cobrança**
   ```
   GET /api/v1/charge/:correlationID
   Headers:
     Authorization: <WOOVI_API_KEY>
   ```

3. **Webhook Events**
   - `charge.completed` - Pagamento confirmado
   - `charge.expired` - Cobrança expirou
   - `charge.failed` - Pagamento falhou

### Recursos Úteis

- 📚 **API Docs**: https://developers.woovi.com/api
- 🔧 **GitHub**: https://github.com/woovibr/woovi-developers
- 💬 **Suporte**: Contato via dashboard Woovi
- 📊 **Status**: https://status.woovi.com

---

## ✅ Checklist de Setup Completo

### Configuração Base

- [ ] Conta Woovi criada (https://app.woovi.com)
- [ ] API Key obtida (Production)
- [ ] HMAC Webhook Secret copiado
- [ ] JWT Secret gerado (128 chars)

### Neobot Local

- [ ] `.env` configurado com todas as variáveis
- [ ] `FLOWPAY_API_URL` apontando para Railway
- [ ] `WOOVI_API_KEY` configurada
- [ ] `FLOWPAY_JWT_SECRET` definido
- [ ] `WOOVI_WEBHOOK_SECRET` (HMAC) configurado
- [ ] Permissões do `.env`: 600

### Railway (FlowPay API)

- [ ] Service deployado
- [ ] `WOOVI_API_KEY` adicionada em Variables
- [ ] `WOOVI_WEBHOOK_SECRET` adicionada
- [ ] `JWT_SECRET` adicionado (mesmo do Neobot)
- [ ] Service reiniciado após adicionar variables

### Netlify (Webhook Handler)

- [ ] Site `flowpaypix` deployado
- [ ] Function `webhook-handler` funcionando
- [ ] `WOOVI_WEBHOOK_SECRET` configurado
- [ ] `JWT_SECRET` configurado
- [ ] URL testada: `flowpaypix.netlify.app/.netlify/functions/webhook-handler`

### Woovi Dashboard

- [ ] Webhook adicionado com URL do Netlify
- [ ] Eventos selecionados: `charge.completed`, `charge.expired`
- [ ] Webhook testado (200 OK)
- [ ] Logs verificados

### Testes E2E

- [ ] Criar cobrança via Neobot (skill ou agent)
- [ ] QR Code gerado com sucesso
- [ ] Pagar PIX via banco
- [ ] Webhook recebido no Netlify
- [ ] Status atualizado para "completed"
- [ ] Produto desbloqueado

---

## 🐛 Troubleshooting Avançado

### Erro: "401 Unauthorized" (Railway)

**Causa**: `WOOVI_API_KEY` não configurada ou inválida no Railway

**Solução**:
1. Verificar se a key está no Railway Variables
2. Confirmar que é a Production Key (não Development)
3. Re-gerar key no dashboard Woovi se necessário
4. Restart Railway service após mudança

### Erro: "Invalid webhook signature" (Netlify)

**Causa**: `WOOVI_WEBHOOK_SECRET` incorreto ou não configurado

**Solução**:
1. Copiar secret exato do dashboard Woovi
2. Confirmar que está configurado no Netlify Env
3. Verificar que não tem espaços extras no início/fim
4. Redeploy Netlify após mudança

### Erro: "JWT token invalid"

**Causa**: `JWT_SECRET` diferente entre serviços

**Solução**:
1. Escolher um único secret (128 chars)
2. Configurar EXATAMENTE o mesmo em:
   - Neobot `.env`: `FLOWPAY_JWT_SECRET`
   - Railway: `JWT_SECRET`
   - Netlify: `JWT_SECRET`
3. Restart todos os serviços

### Webhook não está sendo chamado

**Causa**: URL incorreta ou webhook não configurado na Woovi

**Solução**:
1. Verificar URL no dashboard Woovi: `https://flowpaypix.netlify.app/.netlify/functions/webhook-handler`
2. Testar URL diretamente (deve retornar 405 Method Not Allowed para GET)
3. Verificar logs do Netlify durante pagamento
4. Confirmar que eventos corretos estão selecionados

---

## 🚀 Próximos Passos

1. **Configure Railway agora** com as 3 variáveis obrigatórias
2. **Teste E2E** criando uma cobrança real de R$ 1,00
3. **Monitore os logs** de todos os serviços durante o teste
4. **Documente qualquer problema** encontrado para ajustes

**Após tudo funcionando**:
- Configurar produtos reais (SKUs, preços)
- Integrar com sistema de membros/assinaturas
- Configurar emails de confirmação
- Setup de monitoramento e alertas

---

**Status**: 📚 Guia Completo  
**Última atualização**: 30 Jan 2026  
**Baseado em**: Documentação Oficial Woovi
