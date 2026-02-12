# 🔔 Webhook FlowPay - Railway Setup

## ✅ Configuração Correta (Atualizada)

### 📍 URL do Webhook

```
https://flowpay-production-10d8.up.railway.app/api/webhook
```

**IMPORTANTE:** O webhook está hospedado no **Railway**, não na Netlify!

---

## 🎯 Configuração no Dashboard Woovi

### 1. Acesse o Dashboard Woovi

- URL: https://app.woovi.com
- Login com suas credenciais

### 2. Configure o Webhook

**Navegação:** Settings → Webhooks → Add Webhook

**Dados para preencher:**

```yaml
URL: https://flowpay-production-10d8.up.railway.app/api/webhook
Authorization: floCRm/uSS7U5100  # Seu WOOVI_WEBHOOK_SECRET
Eventos selecionados:
  - charge.completed  # Quando o PIX é pago
  - charge.expired    # Quando a cobrança expira
```

### 3. Salvar Configuração

Clique em "Save" e teste enviando um webhook de teste.

---

## 🧪 Como Testar o Webhook

### Opção 1: Via Dashboard Woovi

1. Acesse a aba de Webhooks
2. Selecione o webhook configurado
3. Clique em "Send Test Event"
4. Escolha `charge.completed` como evento
5. Verifique os logs no Railway

### Opção 2: Criar Cobrança Real

```bash
# 1. Criar cobrança de teste
./scripts/flowpay/test-integration.sh

# 2. Pagar o PIX via app bancário

# 3. Verificar logs no Railway
# Railway Dashboard → Deployments → View Logs
# Procure por: [Webhook] Received charge.completed
```

---

## 🔍 Validação HMAC no Railway

O backend Railway valida automaticamente o HMAC:

```javascript
// Railway backend valida assim:
const signature = req.headers['x-webhook-signature'];
const expectedSignature = crypto
  .createHmac('sha256', process.env.WOOVI_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## 📊 Fluxo Completo

```
1. Cliente paga PIX
   ↓
2. Woovi detecta pagamento
   ↓
3. Woovi envia webhook para Railway
   URL: https://flowpay-proxxxxy.app/api/webhook
   Authorization: floxxxxx100
   ↓
4. Railway valida HMAC
   ↓
5. Railway processa evento
   - Atualiza status da cobrança
   - Notifica o sistema
   - Libera acesso/produto
```

---

## 🚨 Troubleshooting

### Webhook não está sendo recebido

**Verificar:**

1. **URL correta no Woovi Dashboard**
   ```
   ✅ https://flowpaxxxxxxx.app/api/webhook
   ❌ https://flowpayxxxxx.app/...
   ```

2. **Railway está UP**
   ```bash
   curl https://flowpay-xxxxxx.app/
   # Deve retornar HTML da landing page
   ```

3. **WOOVI_WEBHOOK_SECRET configurado no Railway**
   - Railway Dashboard → Variables
   - Deve conter: `WOOVI_WEBHOOK_SECRET=xxxx`

4. **Logs do Railway**
   ```
   Railway Dashboard → Deployments → View Logs
   Filtrar por: "webhook" ou "signature"
   ```

### Erro: "Invalid signature"

**Causas comuns:**

1. Secret diferente entre Woovi e Railway
2. Formato do Authorization header incorreto
3. Body da requisição foi modificado

**Solução:**

```bash
# 1. Confirmar secret no Railway
# Railway Dashboard → Variables → WOOVI_WEBHOOK_SECRET

# 2. Confirmar secret no Woovi
# Woovi Dashboard → Webhooks → Edit → Authorization field

# 3. Ambos devem ser IDÊNTICOS
```

---

## 📝 Variáveis Necessárias

### No Railway (Backend)



#
## 🎯 Status Atual

| Componente | Status | URL |
|------------|--------|-----|
| **Railway Backend** | ✅ ATIVO | https://flowpay-production-10d8.up.railway.app |
| **Webhook Endpoint** | ✅ PRONTO | `/api/webhook` |
| **Woovi Dashboard** | ⏳ CONFIGURAR | https://app.woovi.com |
| **Teste E2E** | ⏳ PENDENTE | Aguarda config Woovi |

---

## 📚 Documentação Relacionada

- [FLOWPAY_WOOVI.md](./FLOWPAY_WOOVI.md) - Fonte única da verdade
- [WOOVI_API_PATTERN.md](./WOOVI_API_PATTERN.md) - Padrão de autenticação
- [ENV_VARIABLES_GUIDE.md](./ENV_VARIABLES_GUIDE.md) - Guia de variáveis
- [TROUBLESHOOTING_RAILWAY.md](./TROUBLESHOOTING_RAILWAY.md) - Solução de problemas

---

## ✅ Próximo Passo

**Configure AGORA no Woovi Dashboard:**
1. Acesse https://app.woovi.com
2. Vá em Webhooks
3. Use a URL: `https://flowpay-production-10d8.up.railway.app/api/webhook`
4. Authorization: ddxxxxx
5. Eventos: `charge.completed`, `charge.expired`
6. Salve e teste!

---

*Atualizado em: 30/01/2026*
*Railway URL: https://flowpay-production-10d8.up.railway.app*
