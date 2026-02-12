<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ADR-002 · FLOWPAY PAYMENT GATEWAY
           ACCESS UNLOCK PRIMARY
========================================
```

**Status:** ACCEPTED ✅  
**Date:** 2026-01-30  
**Decider:** NODE NEØ (Node Architect)  
**Priority:** 🔥🔥 CRITICAL (PAYS BILLS!)

────────────────────────────────────────

## CONTEXT

FlowPay is the PIX → Crypto gateway that
monetizes the entire NEØ ecosystem.

It's a 208-file Astro application that
needs integration with Neobot while
remaining independent (Railway + Netlify).

**Revenue Critical:** This project pays
MELLØ's bills and unblocks all other
revenue streams.

────────────────────────────────────────

## DECISION

**Integration Model B: Access Unlock Primary**

FlowPay implements:
- **Primary:** Immediate access unlock on payment
- **Secondary:** Token as invisible ledger

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PIX PAYMENT FLOW
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Customer clicks "Buy" (Product page)
┃    └─> Neobot skill: flowpay:buy
┃        └─> Creates charge (Woovi/OpenPix)
┃            └─> Returns QR code
┃
┃ 2. Customer pays via PIX (R$)
┃    └─> Bank processes payment
┃        └─> Woovi confirms
┃            └─> Webhook: POST /api/webhooks/pix
┃
┃ 3. Webhook triggers auto-unlock
┃    └─> Neobot skill: flowpay:unlock
┃        └─> Generates UNLOCK_RECEIPT
┃            └─> Contains: unlock_token (JWT)
┃
┃ 4. Customer accesses product
┃    └─> Middleware validates unlock_token
┃        └─> Access granted ✅
┃            └─> Token invisibly recorded
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## VALUE MODEL

**Primary Value:** Access
- Customer pays → Receives JWT token
- Token = Proof of payment
- Token = Access credential
- No blockchain wait time
- Immediate satisfaction ✅

**Secondary Value:** Token (Invisible)
- Token recorded on-chain (background)
- Customer doesn't see/care
- Ledger for provenance
- Optional future utility

────────────────────────────────────────

## CONSEQUENCES

### Positive ✅

1. **Instant gratification**
   - No waiting for blockchain
   - Customer happy immediately
   - Better UX

2. **Revenue first**
   - PIX → Access = value
   - Token = bonus
   - Sovereignty follows

3. **Simple onboarding**
   - No wallet setup required
   - No gas fees
   - No Web3 complexity

4. **Provenance preserved**
   - On-chain ledger (background)
   - Future composability
   - Proof of ownership

### Negative ⚠️

1. **Token not obvious**
   - Customer may not know they have it
   - Mitigated by optional dashboard

2. **Requires backend**
   - unlock_token needs validation
   - JWT middleware required

────────────────────────────────────────

## TECHNICAL DETAILS

### Neobot Skills

1. **flowpay:buy**
   - Creates charge (PIX QR code)
   - Stores correlation ID
   - Returns charge details

2. **flowpay:status**
   - Checks payment status
   - Queries Woovi API
   - Returns paid/pending/expired

3. **flowpay:unlock**
   - Triggered by webhook
   - Generates UNLOCK_RECEIPT
   - Contains JWT token
   - Saves to: `data/flowpay/receipts/`

### Webhook Flow

```typescript
// netlify/functions/pix-webhook.mjs
export async function handler(event) {
  const payload = JSON.parse(event.body);
  
  if (payload.event === 'CHARGE_COMPLETED') {
    // Call Neobot unlock skill
    await fetch('NEOBOT_UNLOCK_URL', {
      method: 'POST',
      body: JSON.stringify({
        charge_id: payload.charge.correlationID,
        amount: payload.charge.value,
        customer_ref: payload.charge.customer.taxID
      })
    });
  }
  
  return { statusCode: 200 };
}
```

### Authentication

```typescript
// Product middleware (example)
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

────────────────────────────────────────

## DATA STRUCTURES

### UNLOCK_RECEIPT

```json
{
  "receipt_id": "uuid",
  "charge_id": "correlation_id",
  "amount_brl": 99.90,
  "product_ref": "smart-factory-basic",
  "customer_ref": "12345678900",
  "unlock_token": "eyJhbGc...",
  "token_materialization": {
    "chain": "base",
    "contract": "0x...",
    "token_id": 123,
    "tx_hash": "0x...",
    "status": "pending|confirmed"
  },
  "created_at": "ISO",
  "expires_at": "ISO"
}
```

────────────────────────────────────────

## ALTERNATIVES CONSIDERED

### Model A: Token Primary
- Customer must understand Web3
- Requires wallet setup
- Gas fees
- Complex UX
- ❌ NOT CHOSEN (too complex)

### Model B: Access Unlock Primary ← CHOSEN
- PIX → Immediate access
- Token = invisible ledger
- Simple UX
- Revenue first
- ✅ CHOSEN

### Model C: Hybrid (Both Equal)
- Customer chooses path
- Dual complexity
- ❌ NOT CHOSEN (confusing)

────────────────────────────────────────

## SUCCESS METRICS

**Week 1 (MVP):**
- ✅ 1 real payment (R$ > 0)
- ✅ 1 UNLOCK_RECEIPT generated
- ✅ Customer accessed product
- ✅ No refund needed

**Month 1 (Validation):**
- 10+ sales
- R$1,000+ revenue
- 90%+ success rate
- 0 refunds

**Quarter 1 (Scale):**
- R$10,000+ revenue
- 3+ products
- Auto-pilot operations

────────────────────────────────────────

## REFERENCES

- `docs/integrations/flowpay/7-DAY-EXECUTION-PLAN.md`
- `docs/integrations/flowpay/architecture.md`
- Woovi Docs: https://developers.woovi.com
- Web3Auth: https://web3auth.io

────────────────────────────────────────

## RELATED ADRS

- ADR-003 (Smart Factory): Tokenization
- ADR-001 (FlowCloser): Integration model

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Revenue First. Sovereignty Follows.
 Access is Product. Token is Proof.
 Closed Loop > Open Dream."

Ship > Perfect.
────────────────────────────────────────
