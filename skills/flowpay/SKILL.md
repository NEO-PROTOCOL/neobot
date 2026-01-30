# FlowPay Skills

Payment gateway skills for PIX → Access Unlock

## Overview

FlowPay is the CRITICAL revenue gateway
for NEØ Protocol. It closes the loop:

**Lead → Agency → Payment → Access**

Model B (Access Unlock Primary):

- PIX payment → Unlock access
- Token as invisible ledger
- Web2 UX, Web3 infrastructure

## Available Commands

### Buy (Create Charge)

Create PIX charge for product/service.

```bash
moltbot flowpay:buy \
  --amount_brl 99.90 \
  --product_ref "smart-factory-basic" \
  --customer_ref "+5562983231110"
```

Returns:

- PIX QR code
- Copy-paste code
- Checkout URL
- Charge ID

### Status (Check Payment)

Check if payment was confirmed.

```bash
moltbot flowpay:status \
  --charge_id "woovi_abc123"
```

Returns:

- Payment status (PAID, PENDING, etc)
- Payment details
- Timestamps

### Unlock (Grant Access)

Transform PAID status into access.

```bash
moltbot flowpay:unlock \
  --charge_id "woovi_abc123"
```

Returns:

- UNLOCK_RECEIPT (sovereign receipt)
- unlock_token (JWT for auth)
- access_url (where to access)
- permissions (what user can do)

## Integration

FlowPay runs independently at:

- **Production:** flowpaypix.netlify.app
- **Local:** /CODIGOS/flowpay/
- **GitHub:** neomello/flowpay
- **Deploy:** Netlify (auto)
- **Status:** 90% complete

## Tech Stack

- **Framework:** Astro
- **Auth:** Web3Auth
- **Payment:** Woovi/OpenPix (PIX)
- **Blockchain:** QuickNode
- **Deploy:** Netlify

## Documentation

Complete documentation:
`docs/integrations/flowpay/`

## Configuration

Integration config:
`extensions/flowpay/integration.json`

## Architecture Decision

See: `ADR-002-access-unlock-primary.md`

**Decision:** Model B (Access Unlock)
- PIX → Access (primary)
- Token → Ledger (secondary)

## Revenue Impact

**CRITICAL:** This pays Mellø's bills! 💰

Without FlowPay:
- No agency revenue
- No Smart Factory monetization
- No WOD/FLUXX sales
- No closed loop

**Priority:** HIGHEST

## Prerequisites

- FlowPay running (local or production)
- FLOWPAY_API_KEY configured
- Woovi/OpenPix account
- Product catalog defined

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Revenue first. Sovereignty follows.
 Access is product. Token is proof."

Closed loop > Open dream.
────────────────────────────────────────
