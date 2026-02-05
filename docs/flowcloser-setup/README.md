# FlowCloser - Sales Agent
> **Role:** WhatsApp Sales & Customer Service Agent  
> **Repository:** https://github.com/NEO-PROTOCOL/neo-node-interplanetary  
> **Deployment:** Railway (sales.neoprotocol.space)

---

## Purpose

FlowCloser is a lightweight, focused agent designed exclusively for:
- WhatsApp customer interactions
- Lead qualification
- Payment notifications
- Token delivery confirmations

**NOT** for coding, DevOps, or architecture tasks (that's Neobot's job).

---

## Architecture

```
┌─────────────────────────────────────────┐
│         FLOWCLOSER AGENT                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌──────────────┐   │
│  │   Baileys    │   │  Nexus       │   │
│  │  (WhatsApp)  │   │  Client      │   │
│  └──────────────┘   └──────────────┘   │
│         │                   │           │
│         ▼                   ▼           │
│  ┌─────────────────────────────────┐   │
│  │     Message Handler             │   │
│  │  - Lead Qualification           │   │
│  │  - Payment Confirmations        │   │
│  │  - Token Delivery Notices       │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Setup

1. **Initialize Repository:**
   ```bash
   cd /Users/nettomello/CODIGOS/flowcloser
   git init
   git remote add origin https://github.com/NEO-PROTOCOL/neo-node-interplanetary.git
   git fetch origin
   git checkout -b main origin/main || git checkout --orphan main
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run Locally:**
   ```bash
   pnpm dev
   ```

---

## Integration with Nexus

FlowCloser listens to the Nexus for events:

**Endpoint:** `POST /api/webhook/nexus`

**Events Handled:**
- `MINT_CONFIRMED`: Send WhatsApp notification with token details
- `PAYMENT_RECEIVED`: Confirm payment receipt to customer

**Authentication:** HMAC signature validation using `NEXUS_SECRET`

---

## Deployment

**Platform:** Railway  
**Domain:** sales.neoprotocol.space  
**Health Check:** `/health`

**Environment Variables (Railway):**
- `NEXUS_SECRET`
- `WHATSAPP_SESSION_PATH`
- `PORT`

---

## Differences from Neobot

| Feature | Neobot (Architect) | FlowCloser (Sales) |
|---------|-------------------|-------------------|
| **Purpose** | Dev tool, architecture | Customer service |
| **Complexity** | High (coding, tools) | Low (chat only) |
| **Dependencies** | Many (Pi, Claude, etc) | Few (Baileys, Express) |
| **Repository** | neomello/neobot | NEO-PROTOCOL/neo-node-interplanetary |
| **Deployment** | Local/Dev | Railway Production |

---

**Status:** Awaiting Implementation  
**Next Step:** Create minimal Express + Baileys setup
