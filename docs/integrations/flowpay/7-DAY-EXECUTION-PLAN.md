<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
    FLOWPAY · 7 DAY EXECUTION PLAN
        CLOSE THE LOOP
========================================
```

No more "audit bonito".
Time to BUILD and SHIP.

**Goal:** 1 real payment → 1 real access
**Timeline:** 7 days
**Model:** B (Access Unlock Primary)

────────────────────────────────────────

## DAY 1: LOCATE & RUN (Done! ✅)

### Objective

Get FlowPay running locally.

### Actions

```bash
# 1. Confirm location
cd /Users/nettomello/CODIGOS/flowpay

# 2. Install dependencies
npm install

# 3. Configure env
cp .env.example .env
# Add: OPENPIX_API_KEY, WEB3AUTH_CLIENT_ID

# 4. Run dev server
npm run dev

# 5. Test pages
open http://localhost:4321
open http://localhost:4321/checkout
```

### Success Criteria

- [ ] FlowPay runs local (port 4321)
- [ ] Checkout page loads
- [ ] No critical errors in console

### Output

`FLOWPAY_LOCAL_TEST.md` with:
- Working endpoints
- Environment vars needed
- Known issues

────────────────────────────────────────

## DAY 2: MAP ENTRYPOINTS

### Objective

Find 3 critical points:
1. Where PIX enters
2. Where status changes
3. Where order lives

### Actions

```bash
# 1. Find PIX creation
grep -r "OpenPix\|Woovi\|charge" src/

# 2. Find webhook handler
grep -r "webhook\|paid\|confirmed" netlify/

# 3. Find state management
grep -r "order\|payment.*state\|status" src/
```

### Success Criteria

- [ ] PIX creation endpoint found
- [ ] Webhook handler mapped
- [ ] State flow documented

### Output

`FLOWPAY_ENTRYPOINTS_MAP.md` with:
- File paths
- Function names
- Data flow diagram

────────────────────────────────────────

## DAY 3: TEST SKILLS LOCALLY

### Objective

Test 3 Neobot skills against FlowPay.

### Actions

```bash
cd /Users/nettomello/CODIGOS/neobot

# 1. Test buy skill
pnpm moltbot flowpay:buy \
  --amount_brl 0.01 \
  --product_ref "test-product" \
  --customer_ref "test@neo.space"

# 2. Get charge_id from output

# 3. Test status skill
pnpm moltbot flowpay:status \
  --charge_id "CHARGE_ID_HERE"

# 4. Manually mark as PAID in Woovi dashboard

# 5. Test unlock skill
pnpm moltbot flowpay:unlock \
  --charge_id "CHARGE_ID_HERE"
```

### Success Criteria

- [ ] buy creates charge (QR code returned)
- [ ] status checks correctly
- [ ] unlock generates UNLOCK_RECEIPT

### Output

- `data/flowpay/receipts/{receipt_id}.json`
- Skills working end-to-end

────────────────────────────────────────

## DAY 4: WEBHOOK INTEGRATION

### Objective

Auto-trigger unlock on PIX payment.

### Actions

```bash
# 1. Add webhook endpoint in FlowPay
# File: netlify/functions/pix-webhook.mjs

export async function handler(event) {
  const payload = JSON.parse(event.body);
  
  if (payload.event === 'CHARGE_COMPLETED') {
    // Call Neobot unlock
    await fetch('NEOBOT_UNLOCK_URL', {
      method: 'POST',
      body: JSON.stringify({
        charge_id: payload.charge.correlationID
      })
    });
  }
  
  return { statusCode: 200 };
}

# 2. Configure webhook URL in Woovi dashboard
# 3. Test with real PIX payment (R$0.01)
```

### Success Criteria

- [ ] Webhook receives PIX confirmation
- [ ] Neobot unlock triggered automatically
- [ ] UNLOCK_RECEIPT generated

### Output

- Working webhook
- Automated unlock flow

────────────────────────────────────────

## DAYS 5-6: FIRST REAL PRODUCT

### Objective

Create 1 real product with access area.

### Product Options

**Option A: Smart Factory Basic**
- Price: R$99.90
- Access: Dashboard + Mint API
- URL: smart-ui-delta.vercel.app/members

**Option B: WOD [X] PRO Membership**
- Price: R$49.90
- Access: Arena + Validator badge
- URL: wodxpro.com/arena

**Option C: FLUXX DAO Stake**
- Price: R$199.00
- Access: Governance + Treasury view
- URL: fluxx-dao.vercel.app/governance

### Actions

```bash
# 1. Create product page
# 2. Add authentication (JWT from unlock_token)
# 3. Protect routes with middleware
# 4. Test full flow:
#    - Buy (PIX payment)
#    - Webhook (auto-unlock)
#    - Access (dashboard loads)
```

### Success Criteria

- [ ] Product page exists
- [ ] Authentication works (unlock_token)
- [ ] Permissions enforced
- [ ] Full flow tested (R$0.01)

### Output

- Working product
- Protected access area
- Real monetization path

────────────────────────────────────────

## DAY 7: FIRST REAL SALE

### Objective

1 real customer pays → receives access.

### Actions

```bash
# 1. Share product link with friend/test user
# 2. They pay via PIX (real R$)
# 3. Webhook auto-unlocks
# 4. They access dashboard
# 5. Celebrate! 🎉
```

### Success Criteria

- [ ] Real money received (R$ > 0)
- [ ] Customer accessed product
- [ ] UNLOCK_RECEIPT generated
- [ ] No refund needed (UX worked!)

### Output

- **LOOP CLOSED ✅**
- First revenue proof
- Validated business model

────────────────────────────────────────

## SUCCESS METRICS

### Week 1 (This Plan)

```text
✅ FlowPay running local
✅ 3 skills working
✅ Webhook automated
✅ 1 product deployed
✅ 1 real sale
✅ 1 UNLOCK_RECEIPT

= LOOP CLOSED
```

### Month 1 (Scale)

```text
- 10+ sales
- 3+ products
- R$1,000+ revenue
- 90%+ success rate
- 0 refunds
```

### Quarter 1 (Validate)

```text
- R$10,000+ revenue
- Agency fully monetized
- Smart Factory FaaS sales
- WOD/FLUXX memberships
- Auto-pilot operations
```

────────────────────────────────────────

## CRITICAL RULES

### DO

- ✅ Ship fast, iterate faster
- ✅ Test with R$0.01 first
- ✅ Document what works
- ✅ Celebrate small wins

### DON'T

- ❌ Perfect the architecture
- ❌ Add "nice to have" features
- ❌ Wait for "perfect" UX
- ❌ Over-engineer anything

────────────────────────────────────────

## BLOCKERS & SOLUTIONS

### Blocker 1: No PIX test environment

**Solution:** Use R$0.01 real payments

### Blocker 2: Webhook not triggering

**Solution:** 
- Check Woovi dashboard config
- Test with ngrok local tunnel
- Add manual trigger button (MVP)

### Blocker 3: Authentication complex

**Solution:**
- Start with simple JWT
- No fancy Web3 auth needed
- unlock_token = access token

────────────────────────────────────────

## DAILY CHECKLIST

```text
┌────────────────────────────────────┐
│ EVERY DAY:                         │
├────────────────────────────────────┤
│ [ ] 1 commit minimum               │
│ [ ] 1 test (manual or auto)        │
│ [ ] 1 blocker documented           │
│ [ ] 1 success celebrated           │
│ [ ] NO "audit bonito"              │
└────────────────────────────────────┘
```

────────────────────────────────────────

## POST-WEEK 1

### If Successful (Loop Closed)

**Week 2-4:** Add products
- Smart Factory (3 tiers)
- WOD memberships
- FLUXX governance

**Month 2:** Scale
- Agency retainer via FlowPay
- Affiliate system
- Recurring payments

**Month 3:** Optimize
- Better UX
- More payment methods
- Token materialization (optional)

### If Blocked

**Fallback Plan:**
- Manual unlock (admin button)
- Simplify to "contact form" → manual
- Still validates product-market fit

────────────────────────────────────────

## MANTRA

```text
╔═══════════════════════════════════════╗
║                                       ║
║   Revenue First.                      ║
║   Autonomous Follows.                ║
║                                       ║
║   Access is Product.                  ║
║   Token is Proof.                     ║
║                                       ║
║   Closed Loop > Open Dream.           ║
║                                       ║
╚═══════════════════════════════════════╝
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"7 days to close the loop.
 Everything else is noise."

Ship > Perfect.
────────────────────────────────────────
