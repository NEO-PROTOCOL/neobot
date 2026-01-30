<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ADR-002 · Access Unlock Primary
        Token as Ledger
========================================
```

Date: 2026-01-30
Status: **ACCEPTED** ✅
Decider: Mellø (Node Architect)
Decision Model: B (Operador, not Builder)

────────────────────────────────────────

## Context

NEØ Protocol has multiple revenue-
generating projects but NO CLOSED LOOP.

FlowPay exists (90% complete) but was
positioned as "PIX → Token" (model A),
making crypto the END GOAL.

This creates friction:
- Requires user crypto knowledge
- Limits market to web3-native only
- Delays monetization
- Complex UX

The ecosystem has capacity but no cycle.

────────────────────────────────────────

## Decision

**We adopt Model B:**

> PIX → Access Unlock (primary)
> Token → Ledger (secondary, invisible)

**Access Unlock = Value Delivery**
**Token = Accounting/Proof (optional)**

────────────────────────────────────────

## Rationale

### 1. Revenue First (Pragmatic)

FlowPay PAYS MELLØ'S BILLS.

Without closed revenue loop:
- Smart Factory = demo
- Agency = no payment processing
- WOD/FLUXX = no monetization

Model B closes loop IMMEDIATELY.

### 2. Market Expansion (Strategic)

**Model A (PIX → Token):**
- Market: Crypto-native only (~5%)
- Friction: High (wallets, gas, etc)
- Time to revenue: Weeks/months

**Model B (PIX → Access):**
- Market: Everyone with PIX (~95%)
- Friction: Low (familiar UX)
- Time to revenue: 7 days

### 3. Web3 Invisible (Architectural)

Token becomes INFRASTRUCTURE:
- Proof of purchase (ledger)
- Governance rights (future)
- Portability (export access)

But NOT the user's concern.

This aligns with NEØ philosophy:
> "Code is law, but users see magic"

### 4. Scales Both Ways (Future-proof)

Model B doesn't BLOCK tokenization.

It makes it OPTIONAL:

```text
Day 1: PIX → Access (revenue)
Day 90: User stakes for governance
Day 180: Export access as NFT

Token grows WITH value,
not AS value.
```

────────────────────────────────────────

## Consequences

### ✅ Positive

1. **Revenue Unblocked**
   - FlowPay operational in days
   - Agency can charge immediately
   - Smart Factory monetizes

2. **UX Simplified**
   - PIX (familiar) → Access (clear)
   - No wallet setup required
   - No gas fees confusion

3. **Market Expanded**
   - Web2 users can buy
   - Corporate clients accessible
   - B2B sales possible

4. **Architecture Preserved**
   - Token still exists
   - Blockchain anchoring optional
   - Sovereign receipts (UNLOCK_RECEIPT)

5. **Regulatory Flexibility**
   - "Access/membership" clearer than
     "token sale" for compliance
   - Reduces securities risk

### ⚠️ Negative

1. **Less "Web3 Purity"**
   - Token not front-and-center
   - May seem "less crypto"
   - Purists may criticize

2. **Two Systems to Maintain**
   - Access system (immediate)
   - Token system (optional/async)

3. **Governance Delayed**
   - Token-based voting comes later
   - Need alternate governance (Notion?)

────────────────────────────────────────

## Alternatives Considered

### Alternative A: PIX → Token (Direct)

**Pros:**
- Pure web3 positioning
- Immediate tokenization
- Clear value prop (for crypto natives)

**Cons:**
- Limits market to 5%
- High friction (wallets/gas)
- Regulatory risk (securities?)
- Delays revenue (weeks not days)

**Rejected because:** Revenue is blocked.

────────────────────────────────────────

### Alternative C: Both Paths (Parallel)

**Description:** Offer both A and B.

**Pros:**
- Maximum flexibility
- Serves all markets

**Cons:**
- 2x complexity
- Confusing messaging
- Split development effort

**Rejected because:** 
Violates "7 day loop" requirement.
Build ONE thing that works, then expand.

────────────────────────────────────────

## Implementation

### Phase 1: Access System (Days 1-7)

```text
PIX Payment
    ↓
Woovi/OpenPix Webhook
    ↓
FlowPay API (status: PAID)
    ↓
Generate UNLOCK_RECEIPT
    ↓
Issue JWT / Signed Token
    ↓
Grant Access (dashboard/API)
```

### Phase 2: Ledger (Async)

```text
UNLOCK_RECEIPT
    ↓
Write to log file / DB
    ↓
(Optional) IPFS anchor
    ↓
(Optional) Mint token silently
    ↓
User never sees unless they
request "blockchain proof"
```

────────────────────────────────────────

## Integration with Neobot

**Skills:**
1. `flowpay:buy` - Create PIX charge
2. `flowpay:status` - Check payment
3. `flowpay:unlock` - Issue access

**Data Flow:**
```text
Client → FlowOFF Agency
            ↓
      moltbot flowpay:buy
            ↓
      (User pays PIX)
            ↓
   Webhook → flowpay:unlock
            ↓
     Access granted + logged
```

────────────────────────────────────────

## Success Metrics

**Week 1 (MVP):**
- [ ] 1 real payment processed
- [ ] 1 access unlocked
- [ ] 1 UNLOCK_RECEIPT generated

**Month 1 (Validation):**
- [ ] 10+ payments
- [ ] 90%+ success rate
- [ ] 0 refund requests

**Quarter 1 (Scale):**
- [ ] R$10k+ processed
- [ ] Agency fully monetized
- [ ] Smart Factory FaaS revenue

────────────────────────────────────────

## References

**NEØ Protocol Philosophy:**
- Revenue enables sovereignty
- Pragmatism over purity
- Infrastructure > Bandeiras

**Related ADRs:**
- ADR-001: FlowCloser Independent
- ADR-003: Tokenization Strategy (future)

**External:**
- Woovi/OpenPix docs
- Web3Auth patterns
- JWT best practices

────────────────────────────────────────

## Appendix: UNLOCK_RECEIPT Standard

See: `UNLOCK_RECEIPT.spec.json`

Core fields:
- `receipt_id` (UUID)
- `charge_id` (payment ref)
- `paid_at` (timestamp)
- `customer_ref` (identity)
- `permissions[]` (access scopes)
- `signature` (cryptographic proof)

Optional:
- `blockchain_anchor` (future)
- `metadata` (context)

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Revenue first. Sovereignty follows.
 Access is product. Token is proof."

Closed loop > Open dream.
────────────────────────────────────────
