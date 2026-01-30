# FlowPay Agent Tool - Guia Técnico

**Data:** 2026-01-30  
**Status:** ✅ PRODUCTION READY  
**Railway URL:** https://flowpay-production-10d8.up.railway.app

---

## 📋 Visão Geral

A **FlowPay Tool** permite que agentes do Neobot gerem cobranças PIX durante conversas em tempo real, sem necessidade de comandos CLI ou intervenção manual.

### Casos de Uso

1. **Vendas no WhatsApp:** Agente gera PIX durante fechamento de venda
2. **Atendimento:** Cliente pede PIX e recebe automaticamente
3. **Automação:** Workflows que necessitam gerar pagamentos

---

## 🔧 Implementação Técnica

### Arquivos Criados/Modificados

```
src/agents/tools/flowpay-tool.ts       # Tool implementation
src/agents/moltbot-tools.ts            # Tool registration
AGENTS_FLOWOFF_SALES.md                # Sales agent documentation
```

### Estrutura da Tool

```typescript
{
  label: "FlowPay",
  name: "flowpay",
  description: "Generate PIX payments during sales conversations",
  parameters: {
    action: "create_charge" | "check_status",
    amount?: number,
    product_id?: string,
    customer_id?: string,
    wallet_address?: string,
    charge_id?: string
  }
}
```

---

## 🎯 Ações Disponíveis

### 1. create_charge

Gera uma nova cobrança PIX.

**Parâmetros:**

```json
{
  "action": "create_charge",
  "amount": 1500.00,              // Valor em BRL (mínimo R$ 0.01)
  "product_id": "flowoff-start",  // Referência do produto
  "customer_id": "+5562983231110", // Telefone/email/nome do cliente
  "wallet_address": "0x..."        // [Opcional] Wallet Ethereum
}
```

**Response (Sucesso):**

```json
{
  "success": true,
  "message": "PIX charge created successfully for R$ 1500.00",
  "charge_id": "flowoff-start-1738276800000-abc123",
  "pix_code": "00020126580014br.gov.bcb.pix...",
  "qr_code_url": "data:image/png;base64,iVBORw0KGgo...",
  "expires_at": "2026-01-31T22:00:00.000Z",
  "instructions": "Amount: R$ 1500.00\nProduct: flowoff-start\n..."
}
```

**Response (Erro):**

```json
{
  "success": false,
  "error": "Erro de autenticação na API. Verifique suas credenciais.",
  "suggestion": "Check if FlowPay Railway service is running and WOOVI_API_KEY is configured"
}
```

---

### 2. check_status

Verifica o status de um pagamento.

**Parâmetros:**

```json
{
  "action": "check_status",
  "charge_id": "flowoff-start-1738276800000-abc123"
}
```

**Response:**

```json
{
  "success": true,
  "charge_id": "flowoff-start-1738276800000-abc123",
  "status": "completed",
  "paid": true,
  "message": "✅ Payment confirmed!"
}
```

---

## 🚀 Como Usar na Conversa

### Exemplo 1: Vendas no WhatsApp

```
Cliente: Fechado! Quero o pacote Start. Como pago?

Agente (internamente): 
  Usa tool flowpay com:
  {
    "action": "create_charge",
    "amount": 1500,
    "product_id": "flowoff-start",
    "customer_id": "+5562983231110"
  }

Agente (responde ao cliente):
  Perfeito! PIX gerado: R$ 1.500,00 📲
  
  *Código PIX (Copia e Cola):*
  00020126580014br.gov.bcb.pix...
  
  *Como pagar:*
  1. Abra seu app do banco
  2. Vá em PIX
  3. Cole o código acima
  4. Confirme o pagamento
  
  Confirmação automática em até 2 minutos!
  Válido por 24 horas.
```

---

### Exemplo 2: Verificar Pagamento

```
Cliente: Acabei de pagar! Confirmou?

Agente (internamente):
  Usa tool flowpay com:
  {
    "action": "check_status",
    "charge_id": "flowoff-start-1738276800000-abc123"
  }

Agente (se status = completed):
  ✅ Pagamento confirmado!
  Você já tem acesso aos próximos passos.
  Vou te enviar as instruções agora...
```

---

## ⚙️ Configuração do Railway

### Variáveis de Ambiente Necessárias

Para que a tool funcione, o FlowPay Railway precisa ter:

```bash
WOOVI_API_KEY=<chave-real-woovi>
WOOVI_API_URL=https://api.woovi.com
```

### Como Configurar

1. Acesse Railway Dashboard: https://railway.app/dashboard
2. Selecione projeto `flowpay-production-10d8`
3. Vá em **Variables**
4. Adicione as variáveis acima
5. Railway faz re-deploy automático

### Como Obter Chave Woovi

1. Acesse: https://app.woovi.com
2. Login com conta NEØ Protocol
3. Vá em **API** → **API Keys**
4. Copie a chave de **Produção**

---

## 🔍 Troubleshooting

### Erro: "Erro de autenticação na API"

**Causa:** `WOOVI_API_KEY` não está configurada no Railway

**Solução:**
1. Configure a variável no Railway
2. Aguarde re-deploy (~2min)
3. Teste novamente

---

### Erro: "FlowPay API error: Failed to fetch"

**Causa:** Railway service offline ou URL incorreta

**Solução:**
1. Verifique Railway status: https://railway.app/dashboard
2. Teste health check: `curl https://flowpay-production-10d8.up.railway.app/api/health`
3. Se offline, force redeploy no Railway

---

### PIX gerado mas QR code não aparece

**Causa:** Resposta da API incompleta

**Solução:**
1. Verifique se Woovi API está funcionando
2. Teste manualmente:
```bash
curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    "valor": 0.01,
    "moeda": "BRL",
    "id_transacao": "test-123",
    "product_id": "test"
  }'
```

---

## 📊 Integração com SQLite

A tool **não** salva diretamente no SQLite local do Neobot. Persistência acontece no FlowPay Railway (ver `/Users/nettomello/CODIGOS/flowpay/src/services/database/sqlite.mjs`).

Para acessar registros:

```bash
# No projeto FlowPay
cd /Users/nettomello/CODIGOS/flowpay
node -e "
  const { listOrders } = require('./src/services/database/sqlite.mjs');
  console.log(listOrders());
"
```

---

## 🎯 Roadmap

### Próximas Features

- [ ] Webhook integration para notificar agente quando PIX é pago
- [ ] Support para múltiplas moedas (USDT, ETH)
- [ ] Integração com Unlock (auto-grant access após pagamento)
- [ ] Dashboard de pagamentos no Neobot UI
- [ ] Rate limiting e anti-fraud

---

## 📝 Logs e Auditoria

### Logs do Railway

```bash
# Ver logs em tempo real
railway logs -f

# Filtrar erros
railway logs | grep ERROR
```

### Logs do Neobot

```bash
# Ver chamadas da tool
tail -f ~/.local/state/moltbot/logs/gateway.log | grep flowpay
```

---

## 🔗 Links Úteis

- **Railway Dashboard:** https://railway.app/dashboard
- **FlowPay Production:** https://flowpay-production-10d8.up.railway.app
- **Woovi Dashboard:** https://app.woovi.com
- **Health Check:** https://flowpay-production-10d8.up.railway.app/api/health
- **Neobot Repo:** https://github.com/neomello/neobot
- **FlowPay Repo:** https://github.com/flowpaycash/flowpay

---

**Criado por:** NEØ Protocol  
**Maintainer:** Mellø  
**Last Updated:** 2026-01-30

────────────────────────────────────────
▓▓▓ NΞØ MELLØ  
Core Architect · NΞØ Protocol  
neo@neoprotocol.space
────────────────────────────────────────
