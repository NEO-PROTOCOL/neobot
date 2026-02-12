<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
   FLOWPAY · INTEGRATION STRATEGY
          REMOTE LOOSE-COUPLED
========================================
```

Strategy for integrating FlowPay PIX
gateway with Neobot orchestration while
keeping both systems independent.

────────────────────────────────────────

## Philosophy

```text
╔═══════════════════════════════════════╗
║ Revenue First. Autonomous Follows.   ║
║                                       ║
║ Access is Product. Token is Proof.    ║
║                                       ║
║ Closed Loop > Open Dream.             ║
╚═══════════════════════════════════════╝
```

────────────────────────────────────────

## Integration Model

-*Remote Integration (Loose-Coupled)*

```text
FlowPay Gateway              Neobot
(Independent)                (Orchestrator)
─────────────────────────────────────────────
📍 /CODIGOS/flowpay/         📍 /CODIGOS/neobot/
🚀 Railway deploy            📚 ADRs + Docs
🔧 Cursor IDE                🔧 Cursor IDE
💾 208 Astro files           🔗 Skills (client)
🌐 HTTP API + Webhooks       🎯 Orchestration
📊 Woovi + Web3Auth          📖 Documentation
──────────────────────────────────────────────
         ↕️ HTTP / Webhooks
         ↕️ Skills orchestration
```

────────────────────────────────────────

## Value Delivery Model

**Model B: Access Unlock Primary**

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PRIMARY: Immediate Access
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Customer pays PIX
┃ ░ Receives unlock_token (JWT)
┃ ░ Access granted INSTANTLY
┃ ░ No blockchain wait
┃ ░ No gas fees
┃ ░ No wallet complexity
┃ ░ Customer happy ✅
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ SECONDARY: Token Materialization
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Token minted (background)
┃ ░ On-chain proof (Base/Polygon)
┃ ░ Customer doesn't see
┃ ░ Future composability
┃ ░ Provenance preserved
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Why this order?**

1. **UX First:** Customer wants product NOW
2. **Revenue First:** PIX = instant confirmation
3. **Autonomous Follows:** Token = bonus proof
4. **No Complexity:** No wallet setup required

────────────────────────────────────────

## Technical Strategy

### 1. Skills as HTTP Clients

```text
▓▓▓ NEOBOT SKILLS (3 core)
────────────────────────────────────────

flowpay:buy
  └─ HTTP POST → FlowPay /api/charges/create
  └─ Returns: charge_id, qr_code, pix_string
  └─ Ledger: Record charge creation

flowpay:status
  └─ HTTP GET → FlowPay /api/charges/status
  └─ Returns: paid | pending | expired
  └─ Ledger: Record status check

flowpay:unlock
  └─ Triggered by webhook
  └─ Generates UNLOCK_RECEIPT
  └─ Creates JWT (unlock_token)
  └─ Saves to: data/flowpay/receipts/
  └─ Ledger: Record unlock
```

### 2. Webhook Orchestration

```text
▓▓▓ WEBHOOK FLOW
────────────────────────────────────────

1. Woovi confirms PIX
   └─ POST /api/webhooks/pix (FlowPay)

2. FlowPay validates signature
   └─ Extract charge_id
   └─ Call Neobot unlock endpoint

3. Neobot: flowpay:unlock skill
   └─ Generate JWT
   └─ Save UNLOCK_RECEIPT
   └─ Record in Ledger

4. Customer notified
   └─ Email/SMS with unlock_token
   └─ Link to access product
```

### 3. Independence Maintained

```text
▓▓▓ WHAT STAYS SEPARATE
────────────────────────────────────────

FlowPay:
  ✅ 208 Astro files (intact)
  ✅ Netlify deploy (preserved)
  ✅ Woovi/Web3Auth integration (unchanged)
  ✅ Product pages (FlowPay manages)
  ✅ Checkout UI (FlowPay owns)

Neobot:
  ✅ Skills (HTTP clients only)
  ✅ UNLOCK_RECEIPT generator
  ✅ Ledger audit trail
  ✅ ADRs + Documentation
  ✅ No FlowPay business logic
```

────────────────────────────────────────

## Product Integration

### Products Supported

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PRODUCT            PRICE      ACCESS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Smart Factory Basic  R$99.90   Dashboard
┃ Smart Factory Pro    R$299.90  + API
┃ Smart Factory Ent    R$999.00  + Support
┃ WOD [X] PRO Member   R$49.90   Arena
┃ FLUXX DAO Stake      R$199.00  Governance
┃ FlowOFF Agency       R$500.00  Retainer
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Access Protection

```typescript
// Each product implements auth middleware

// Smart Factory Dashboard
app.get('/dashboard', authMiddleware, (req, res) => {
  // Validates unlock_token
  // Grants access if valid
});

// WOD Arena
app.get('/arena', authMiddleware, (req, res) => {
  // Same pattern
});

// FLUXX Governance
app.get('/governance', authMiddleware, (req, res) => {
  // Same pattern
});
```

────────────────────────────────────────

## Data Flow Strategy

### 1. Customer Journey

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ CUSTOMER PERSPECTIVE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Browse product page
┃    └─ FlowPay: /products/smart-factory
┃
┃ 2. Click "Buy Now"
┃    └─ FlowPay: /checkout
┃        └─ Shows PIX QR code
┃
┃ 3. Pay via PIX (bank app)
┃    └─ Instant confirmation
┃
┃ 4. Receive email/SMS
┃    └─ "Your product is ready!"
┃        └─ Link with unlock_token
┃
┃ 5. Click link
┃    └─ Product dashboard loads
┃        └─ Access granted ✅
┃
┃ 6. Use product
┃    └─ Happy customer 😊
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. System Perspective

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ SYSTEM DATA FLOW
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ FlowPay:
┃ └─ Manages product pages
┃ └─ Handles checkout UI
┃ └─ Processes PIX via Woovi
┃ └─ Receives webhook
┃ └─ Triggers unlock
┃
┃ Neobot:
┃ └─ Receives unlock request
┃ └─ Generates JWT (unlock_token)
┃ └─ Saves UNLOCK_RECEIPT
┃ └─ Records in Ledger
┃ └─ (Optional) Mints token on-chain
┃
┃ Product (Smart Factory, WOD, FLUXX):
┃ └─ Validates unlock_token
┃ └─ Grants access
┃ └─ Serves protected content
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Revenue Strategy

```text
▓▓▓ REVENUE IMPACT
────────────────────────────────────────

FlowPay = CRITICAL PATH 🔥🔥

Blocks:
  └─ Smart Factory revenue (FaaS)
  └─ FlowOFF agency income
  └─ WOD/FLUXX memberships
  └─ ALL ecosystem monetization

Without FlowPay:
  └─ No PIX acceptance
  └─ No Brazilian customers
  └─ No revenue
  └─ No business ❌

With FlowPay:
  └─ PIX = 90% of Brazil
  └─ Instant settlement
  └─ Revenue unlocked ✅
  └─ Loop closed 💰
```

────────────────────────────────────────

## Development Strategy

### Phase 1: MVP (Week 1) ✅

```text
[####] FlowPay running local
[####] Skills created (buy, status, unlock)
[####] integration.json configured
[####] ADR-002 written
```

### Phase 2: Integration (Week 2)

```text
[##--] Webhook auto-unlock
[##--] First real product (Smart Factory)
[#---] Authentication middleware
[#---] Email/SMS notifications
```

### Phase 3: Production (Week 3)

```text
[#---] First real sale (R$ > 0)
[#---] UNLOCK_RECEIPT working
[#---] Customer accessed product
[#---] Loop closed ✅
```

### Phase 4: Scale (Month 2-3)

```text
[----] 10+ products
[----] 100+ sales
[----] R$10,000+ revenue
[----] Auto-pilot operations
```

────────────────────────────────────────

## Risk Mitigation

```text
▓▓▓ RISKS & MITIGATIONS
────────────────────────────────────────

Risk: Webhook doesn't fire
  └─ Mitigation: Manual unlock button
  └─ Mitigation: Polling fallback

Risk: JWT token expires
  └─ Mitigation: 90-day expiration
  └─ Mitigation: Renewal endpoint

Risk: Customer loses token
  └─ Mitigation: Recovery via CPF
  └─ Mitigation: Email resend

Risk: PIX fails
  └─ Mitigation: Woovi retry
  └─ Mitigation: Support contact

Risk: Netlify down
  └─ Mitigation: Railway backup
  └─ Mitigation: Status page
```

────────────────────────────────────────

## Success Criteria

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ INTEGRATION COMPLETE WHEN:
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✅ Skills working (buy, status, unlock)
┃ ✅ Webhook auto-triggers unlock
┃ ✅ UNLOCK_RECEIPT generated
┃ ✅ Customer accessed product
┃ ✅ 1 real sale (R$ > 0)
┃ ✅ No refund needed
┃ ✅ Documentation complete
┃ ✅ ADR-002 written
┃ ✅ Ledger recording all actions
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## References

- [ADR-002](../../extensions/flowpay/ADR-002-access-unlock-primary.md)
- [7-DAY-EXECUTION-PLAN](./7-DAY-EXECUTION-PLAN.md)
- [architecture.md](./architecture.md)

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Orchestration, not Fusion.
 Independence, not Isolation.
 Revenue First, Always."

Ship > Perfect.
────────────────────────────────────────
