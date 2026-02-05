# FlowCloser - Webhook Notifier
> **Purpose:** Lightweight webhook receiver that sends WhatsApp notifications  
> **Repository:** https://github.com/NEO-PROTOCOL/neo-node-interplanetary  
> **Role:** Notification Bridge (Nexus → WhatsApp)

---

## What is FlowCloser?

FlowCloser is a **micro-service** that:
1. Receives webhook events from Nexus
2. Validates HMAC signatures
3. Sends pre-formatted WhatsApp messages
4. Nothing else.

**NOT** an AI agent. **NOT** a full-featured bot. Just a simple notifier.

---

## Architecture

```
┌─────────────────────────────────────┐
│         FLOWCLOSER SERVICE          │
├─────────────────────────────────────┤
│                                     │
│  POST /api/webhook/nexus            │
│         │                           │
│         ▼                           │
│  ┌──────────────┐                   │
│  │ HMAC Verify  │                   │
│  └──────┬───────┘                   │
│         │                           │
│         ▼                           │
│  ┌──────────────┐                   │
│  │ Event Router │                   │
│  └──────┬───────┘                   │
│         │                           │
│         ▼                           │
│  ┌──────────────┐                   │
│  │   Baileys    │ → WhatsApp        │
│  │  (WhatsApp)  │                   │
│  └──────────────┘                   │
│                                     │
└─────────────────────────────────────┘
```

---

## Setup

```bash
cd /Users/nettomello/CODIGOS/neo-protocol-stack/flowcloser
pnpm install
cp .env.example .env
# Edit .env with your credentials
pnpm dev
```

---

## Environment Variables

```env
PORT=3000
NEXUS_SECRET=your-hmac-secret
WHATSAPP_SESSION_PATH=./whatsapp-session
NODE_ENV=production
```

---

## Webhook Events Handled

### MINT_CONFIRMED
**Payload:**
```json
{
  "event": "MINT_CONFIRMED",
  "payload": {
    "payerId": "5511999999999",
    "contractAddress": "0x123...",
    "txHash": "0xabc...",
    "amount": "1000"
  }
}
```

**WhatsApp Message Sent:**
```
✅ Token Entregue!

Seu token foi mintado com sucesso.

📄 Contrato: 0x123...
🔗 TX: 0xabc...
💰 Quantidade: 1000

Obrigado por fazer parte do NEØ Protocol!
```

### PAYMENT_RECEIVED
**Payload:**
```json
{
  "event": "PAYMENT_RECEIVED",
  "payload": {
    "payerId": "5511999999999",
    "amount": 100.00,
    "transactionId": "pix-123"
  }
}
```

**WhatsApp Message Sent:**
```
✅ Pagamento Confirmado!

Recebemos seu PIX de R$ 100,00.

🔄 Processando seu token...
⏱️ Aguarde alguns minutos.

ID: pix-123
```

---

## Deployment

**Platform:** Railway  
**Domain:** sales.neoprotocol.space  
**Health Check:** `/health`

---

## Differences from Other Agents

| Feature | Neobot | Neo-Agent-Full | FlowCloser |
|---------|--------|----------------|------------|
| AI/LLM | ✅ Claude | ✅ Multiple | ❌ None |
| Tools | ✅ Many | ✅ Some | ❌ None |
| WhatsApp | ❌ No | ✅ Yes | ✅ Yes |
| Webhooks | ❌ No | ⚠️ Complex | ✅ Simple |
| Purpose | Dev Tool | Full Agent | Notifier |
| Complexity | Very High | High | Very Low |

---

**Status:** Ready for Implementation  
**Next:** Run `pnpm install` and configure `.env`
