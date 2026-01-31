# ✅ FlowPay Webhook - URL Correta

## 🎯 Informação Importante

**O webhook FlowPay NÃO está mais na Netlify!**

### URL Correta do Webhook

```
https://flowpay-production-10d8.up.railway.app/api/webhook
```

## 📍 Onde Está Hospedado

| Componente | Plataforma | URL |
|------------|-----------|-----|
| **Frontend** | Netlify | `https://flowpaypix.netlify.app` |
| **Backend + Webhook** | Railway | `https://flowpay-production-10d8.up.railway.app` |
| **API Woovi** | Woovi Cloud | `https://api.woovi.com` |

---

## ⚙️ Configuração no Dashboard Woovi

### 1. Acesse o Dashboard
```
https://app.woovi.com
```

### 2. Navegue até Webhooks
```
Dashboard → API → Webhooks → Adicionar Webhook
```

### 3. Configure o Webhook

**URL do Webhook:**
```
https://flowpay-production-10d8.up.railway.app/api/webhook
```

**Authorization Header:**
```
<seu-WOOVI_WEBHOOK_SECRET>
```

**Eventos para Monitorar:**
- ✅ `charge.completed` (pagamento confirmado)
- ✅ `charge.expired` (cobrança expirada)

---

## 🔐 Variáveis de Ambiente (Railway)

No Railway Dashboard → Variables, configure:

```bash
WOOVI_API_KEY=<sua-chave-base64>
WOOVI_WEBHOOK_SECRET=<seu-secret>
TOKEN_SECRET=<seu-jwt-secret>
```

---

## 🧪 Testar o Webhook

### 1. Criar uma Cobrança de Teste

```bash
./scripts/flowpay/test-integration.sh
```

### 2. Pagar o PIX

Use o QR Code gerado no app do seu banco.

### 3. Verificar Logs no Railway

```bash
# Acesse Railway Dashboard
# Logs → Deployments → View Logs

# Procure por:
[Webhook] Recebido evento: charge.completed
[Webhook] Pagamento confirmado: <correlationID>
```

---

## 🚨 Troubleshooting

### Erro: "Webhook não recebido"

**Verificar:**
1. URL está correta no dashboard Woovi
2. Railway está rodando (sem deploy falho)
3. Authorization header configurado
4. Eventos `charge.completed` e `charge.expired` selecionados

### Erro: "Invalid signature"

**Verificar:**
1. `WOOVI_WEBHOOK_SECRET` no Railway está correto
2. Secret é o mesmo do dashboard Woovi
3. Não tem espaços em branco antes/depois do secret

---

## 📚 Documentação Relacionada

- `ENV_VARIABLES_GUIDE.md` - Variáveis de ambiente
- `RAILWAY_REDEPLOY_GUIDE.md` - Como fazer redeploy
- `TROUBLESHOOTING_RAILWAY.md` - Solução de problemas
- `FLOWPAY_WOOVI.md` - Integração completa

---

## ✅ Checklist de Configuração

- [ ] Webhook configurado no dashboard Woovi
- [ ] URL correta: `https://flowpay-production-10d8.up.railway.app/api/webhook`
- [ ] Authorization header configurado
- [ ] Eventos `charge.completed` e `charge.expired` selecionados
- [ ] Variáveis no Railway configuradas
- [ ] Teste E2E realizado (criar cobrança + pagar)
- [ ] Logs do Railway verificados

---

**Última atualização:** 30/01/2026
**Status:** ✅ Produção (Railway)
