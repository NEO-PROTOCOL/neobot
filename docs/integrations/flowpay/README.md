<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
     FLOWPAY INTEGRATION · OVERVIEW
========================================
```

PIX → Crypto Gateway integrated to
Neobot via **Remote Integration**
(loose-coupled architecture).

────────────────────────────────────────

## Architecture

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowPay Gateway (Independent)
┃ ░ Cursor IDE
┃ ░ PIX → Access conversion
┃ ░ Woovi/OpenPix integration
┃ ░ Web3Auth wallet
┃ ░ Astro framework (208 files)
┃ ░ Netlify deployment
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           │ HTTP API
           │ Webhooks
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Neobot (Orchestrator)
┃ ░ Skills (HTTP client)
┃ ░ Webhook handlers
┃ ░ UNLOCK_RECEIPT generator
┃ ░ ADRs + documentation
┃ ░ Ledger audit trail
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Priority

```text
🔥🔥 CRITICAL - REVENUE GENERATOR

This project PAYS THE BILLS!

Blocks:
- Smart Factory revenue
- Agency income
- All ecosystem monetization
```

────────────────────────────────────────

## Location

```text
▓▓▓ FLOWPAY PATHS
────────────────────────────────────────
└─ Local: /CODIGOS/flowpay/
└─ GitHub: neomello/flowpay
└─ Netlify: flowpaypix.netlify.app
└─ IDE: Cursor
└─ Framework: Astro (208 files)
```

────────────────────────────────────────

## Available Skills

```bash
# Create PIX charge
moltbot flowpay:buy \
  --amount_brl 99.90 \
  --product_ref "smart-factory-basic" \
  --customer_ref "12345678900"

# Check payment status
moltbot flowpay:status \
  --charge_id "abc123"

# Unlock access (triggered by webhook)
moltbot flowpay:unlock \
  --charge_id "abc123"
```

────────────────────────────────────────

## Convenience Scripts

```bash
# Health check (local + prod)
./scripts/flowpay/check-health.sh

# Run local dev server
./scripts/flowpay/run-local.sh

# Test webhook locally
./scripts/flowpay/test-webhook.sh

# Deploy to Netlify
./scripts/flowpay/deploy.sh
```

────────────────────────────────────────

## Integration Model

**Model B: Access Unlock Primary**

```text
PIX Payment → Immediate Access
Token Materialization → Background

Value delivery: INSTANT ✅
Token proof: INVISIBLE LEDGER
```

See: [ADR-002](../../extensions/flowpay/ADR-002-access-unlock-primary.md)

────────────────────────────────────────

## ADRs

**Architecture Decision Records:**

- [ADR-002](../../extensions/flowpay/ADR-002-access-unlock-primary.md)
  Payment gateway strategy (Model B)

────────────────────────────────────────

## Documentation

```text
▓▓▓ COMPLETE DOCUMENTATION
────────────────────────────────────────
└─ strategy.md        Integration approach
└─ architecture.md    System diagrams
└─ api-reference.md   API endpoints
└─ development.md     How to develop
└─ troubleshooting.md Debug guide
└─ CHANGELOG.md       Change history
└─ 7-DAY-EXECUTION-PLAN.md  Mission plan
```

────────────────────────────────────────

## Configuration

Integration config:
`extensions/flowpay/integration.json`

Contains:

- Endpoints (buy, status, unlock, webhook)
- Deploy platform (Netlify)
- Tech stack (Astro, Web3Auth, Woovi)
- Repository URLs
- Revenue impact: PAYS_BILLS 💰

────────────────────────────────────────

## Development Workflow

```text
▓▓▓ CURSOR (FlowPay)
────────────────────────────────────────
└─ Make changes in Astro app
└─ Test locally (port 4321)
└─ Commit to flowpay repo
└─ Netlify auto-deploys

▓▓▓ CURSOR (Neobot)
────────────────────────────────────────
└─ Create/update skills
└─ Test via CLI
└─ Handle webhooks
└─ Generate UNLOCK_RECEIPTS
```

────────────────────────────────────────

## Quick Start

**1. Run FlowPay locally:**

```bash
cd /Users/nettomello/CODIGOS/flowpay
npm run dev
# Opens at http://localhost:4321
```

**2. Test buy skill:**

```bash
moltbot flowpay:buy \
  --amount_brl 0.01 \
  --product_ref "test" \
  --customer_ref "00000000000"
```

**3. Check health:**

```bash
./scripts/flowpay/check-health.sh
```

────────────────────────────────────────

## Current Mission

**7-DAY EXECUTION PLAN:**

```text
DAY 1-2: FlowPay running local ✅
DAY 3:   Skills testing
DAY 4:   Webhook auto-unlock
DAY 5-6: First real product
DAY 7:   FIRST REAL SALE 💰
```

See: [7-DAY-EXECUTION-PLAN.md](./7-DAY-EXECUTION-PLAN.md)

────────────────────────────────────────

## Revenue Loop

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ THE REVENUE LOOP (CLOSED!)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Lead via Instagram DM
┃    └─> FlowCloser qualifies
┃
┃ 2. Lead becomes client
┃    └─> FlowOFF closes deal
┃
┃ 3. Client pays via PIX
┃    └─> FlowPay converts 💰
┃
┃ 4. Webhook auto-unlocks
┃    └─> Access granted ✅
┃
┃ 5. Client receives product
┃    └─> Smart Factory, WOD, FLUXX
┃
┃ 6. Token invisibly recorded
┃    └─> On-chain provenance
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Revenue First. Autonomous Follows.
 Access is Product. Token is Proof.
 Closed Loop > Open Dream."

Ship > Perfect.
────────────────────────────────────────
