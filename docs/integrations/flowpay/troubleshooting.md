<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
       FLOWPAY · TROUBLESHOOTING
========================================
```

Debug guide for common FlowPay issues.

────────────────────────────────────────

## Quick Diagnosis

```bash
# Health check
./scripts/flowpay/check-health.sh

# Test buy skill
moltbot flowpay:buy \
  --amount_brl 0.01 \
  --product_ref "test" \
  --customer_ref "00000000000"

# Check status
moltbot flowpay:status --charge_id "CHARGE_ID"

# Manual unlock (test)
moltbot flowpay:unlock --charge_id "CHARGE_ID"
```

────────────────────────────────────────

## Common Issues

### 1. PIX Charge Creation Fails

**Symptoms:**

```text
Error: Failed to create charge
Woovi API returned 401
```

**Causes:**

- Invalid Woovi API key
- Expired API key
- Rate limit exceeded
- Network issue

**Solutions:**

```bash
# Check API key
echo $WOOVI_API_KEY

# Regenerate key in Woovi dashboard
# https://app.openpix.com.br/api-keys

# Test Woovi API directly
curl -X POST https://api.openpix.com.br/api/v1/charge \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "correlationID": "test-123",
    "value": 100
  }'

# Update .env
# WOOVI_API_KEY=new_key_here

# Restart FlowPay
pnpm dev
```

────────────────────────────────────────

### 2. Webhook Not Firing

**Symptoms:**

```text
PIX payment confirmed in bank
Woovi dashboard shows "COMPLETED"
But unlock never triggers
```

**Causes:**

- Webhook URL incorrect
- ngrok tunnel expired
- Signature validation failed
- Netlify function timeout

**Solutions:**

```bash
# Check Woovi webhook config
# Dashboard → Webhooks → View

# Verify URL
# Local: https://YOUR-NGROK-ID.ngrok.io/api/webhooks/pix
# Prod: https://flowpaypix.netlify.app/api/webhooks/pix

# Test webhook manually
curl -X POST http://localhost:4321/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -H "x-woovi-signature: test" \
  -d '{
    "event": "CHARGE_COMPLETED",
    "charge": {
      "correlationID": "test-123",
      "value": 9990,
      "status": "COMPLETED"
    }
  }'

# Check Netlify logs
netlify logs

# Check signature validation
# File: netlify/functions/pix-webhook.mjs
# Ensure WOOVI_WEBHOOK_SECRET matches dashboard
```

────────────────────────────────────────

### 3. Unlock Token Invalid

**Symptoms:**

```text
Error: Invalid token
JWT verification failed
Customer can't access product
```

**Causes:**

- JWT_SECRET mismatch
- Token expired
- Token malformed
- Wrong product_ref

**Solutions:**

```bash
# Verify JWT_SECRET
# Check .env in both FlowPay and Neobot
echo $JWT_SECRET

# Must be SAME in both repos!

# Decode token (debug)
# https://jwt.io
# Paste unlock_token
# Check expiration (exp field)

# Check UNLOCK_RECEIPT file
cat data/flowpay/receipts/RECEIPT_ID.json

# Regenerate token
moltbot flowpay:unlock --charge_id "CHARGE_ID"

# Test token validation
node -e "
const jwt = require('jsonwebtoken');
const token = 'eyJhbGc...';
const secret = process.env.JWT_SECRET;
try {
  const decoded = jwt.verify(token, secret);
  console.log('Valid:', decoded);
} catch (err) {
  console.error('Invalid:', err.message);
}
"
```

────────────────────────────────────────

### 4. Customer Can't Access Product

**Symptoms:**

```text
Customer clicks access link
Gets 401 Unauthorized
Or 403 Forbidden
```

**Causes:**

- Token not in Authorization header
- Middleware not configured
- Wrong product_ref in token
- Token expired

**Solutions:**

```bash
# Check product middleware
# File: src/pages/products/smart-factory.astro
# Ensure authMiddleware is active

# Test with curl
curl -H "Authorization: Bearer UNLOCK_TOKEN" \
  http://localhost:4321/products/smart-factory

# Should return 200 OK

# Check token payload
# Ensure product_ref matches URL

# Example:
# Token has: product_ref: "smart-factory-basic"
# URL must be: /products/smart-factory-basic
# NOT: /products/smart-factory

# Regenerate token if needed
```

────────────────────────────────────────

### 5. Local Dev Server Won't Start

**Symptoms:**

```text
Error: Port 4321 already in use
EADDRINUSE
```

**Solutions:**

```bash
# Kill existing process
killall node

# Or find and kill specific process
lsof -i :4321
kill -9 PID

# Change port (astro.config.mjs)
export default defineConfig({
  server: {
    port: 4322
  }
});

# Restart
pnpm dev
```

────────────────────────────────────────

### 6. Netlify Deploy Fails

**Symptoms:**

```text
Build failed
Deploy failed
Error during build
```

**Causes:**

- Missing environment variables
- Node version mismatch
- Build command incorrect
- Dependency issue

**Solutions:**

```bash
# Check Netlify build logs
# Dashboard → Deploys → Failed deploy → View log

# Verify environment variables
# Dashboard → Site settings → Environment variables
# Must have:
# - WOOVI_API_KEY
# - JWT_SECRET
# - WEB3AUTH_CLIENT_ID
# - NODE_ENV=production

# Check Node version
# netlify.toml
[build.environment]
  NODE_VERSION = "20"

# Clear cache and rebuild
# Dashboard → Deploys → Clear cache → Trigger deploy

# Test build locally
pnpm install
pnpm build

# Should complete without errors
```

────────────────────────────────────────

### 7. QR Code Not Displaying

**Symptoms:**

```text
Checkout page loads
But QR code is blank
Or "data:image/png..." text shows
```

**Causes:**

- Woovi API didn't return QR
- Image component broken
- CORS issue

**Solutions:**

```bash
# Check Woovi response
# Should include:
# - qr_code (base64 image)
# - pix_copy_paste (string)

# Verify QRCode component
# File: src/components/QRCode.astro
# Ensure src attribute uses data URL

# Example:
<img src={qr_code} alt="QR Code PIX" />

# Not:
<img src="/images/qr.png" />

# Test QR generation
# Copy qr_code value
# Paste into browser address bar
# Should show PNG image
```

────────────────────────────────────────

### 8. Skills Not Working

**Symptoms:**

```text
moltbot flowpay:buy
Error: Skill not found
Or: Command not recognized
```

**Causes:**

- Skills not registered
- Neobot not recognizing skills
- Path issue

**Solutions:**

```bash
# Check skills directory
ls /Users/nettomello/CODIGOS/neobot/skills/flowpay/

# Should show:
# - buy.ts
# - status.ts
# - unlock.ts
# - SKILL.md

# Rebuild Neobot
cd /Users/nettomello/CODIGOS/neobot
pnpm build

# Test skill directly
node dist/skills/flowpay/buy.js

# Check skill registration
# File: src/skills/registry.ts
# Ensure flowpay skills are registered

# List available skills
moltbot skills:list
# Should show flowpay:buy, flowpay:status, flowpay:unlock
```

────────────────────────────────────────

### 9. Ledger Not Recording

**Symptoms:**

```text
Skills work
But no entries in Ledger
```

**Causes:**

- Ledger service not initialized
- Permissions issue
- Path incorrect

**Solutions:**

```bash
# Check Ledger location
ls /Users/nettomello/CODIGOS/neobot/data/ledger/

# Should show .jsonl files

# Check Ledger service
# File: src/infra/ledger.ts
# Ensure initialized

# Test manual entry
moltbot ledger:record \
  --action "test" \
  --actor "user" \
  --channel "cli"

# Check permissions
chmod +w data/ledger/
```

────────────────────────────────────────

### 10. Token Materialization Fails

**Symptoms:**

```text
UNLOCK_RECEIPT created
But token_materialization.status = "pending" forever
On-chain tx never happens
```

**Causes:**

- QuickNode RPC issue
- Gas fees too low
- Contract not deployed
- Background job not running

**Solutions:**

```bash
# This is OPTIONAL (secondary value)
# Access unlock works WITHOUT token materialization

# Check QuickNode RPC
curl $QUICKNODE_RPC_URL \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Should return latest block

# Check contract deployment
# Base: 0x6D539f66fAb95b06da7Def414a...
# Verify on BaseScan

# Trigger materialization manually
moltbot flowpay:materialize-token \
  --receipt_id "RECEIPT_ID"

# Check background job
# File: src/cron/token-materializer.ts
# Ensure cron running
```

────────────────────────────────────────

## Debug Tools

### Health Checks

```bash
# FlowPay health (local)
curl http://localhost:4321/health

# FlowPay health (prod)
curl https://flowpaypix.netlify.app/health

# Woovi API health
curl https://api.openpix.com.br/api/v1/health

# Neobot health
curl http://localhost:8080/health
```

### Log Analysis

```bash
# Netlify logs (real-time)
netlify logs --stream

# Netlify logs (function specific)
netlify logs --function=pix-webhook

# Local dev logs
# Appear in terminal

# Woovi webhook logs
# Dashboard → Webhooks → History
```

### Network Debugging

```bash
# ngrok web interface
open http://127.0.0.1:4040

# Shows all HTTP requests to tunnel

# Test webhook with curl
curl -X POST https://YOUR-NGROK.ngrok.io/api/webhooks/pix \
  -H "Content-Type: application/json" \
  -d @test-webhook-payload.json

# Monitor in ngrok interface
```

────────────────────────────────────────

## Emergency Procedures

### FlowPay Down

```text
1. Check Netlify status
   └─ https://www.netlifystatus.com

2. Check Woovi status
   └─ https://status.openpix.com.br

3. Check logs
   └─ netlify logs

4. Rollback deploy
   └─ Dashboard → Deploys → Previous deploy → Publish

5. Contact support
   └─ Netlify: support@netlify.com
   └─ Woovi: suporte@openpix.com.br
```

### Data Loss

```text
1. Check backups
   └─ data/flowpay/receipts/ (Git tracked)

2. Restore from Git
   └─ git checkout HEAD~1 -- data/

3. Regenerate UNLOCK_RECEIPTs
   └─ Query Woovi API for completed charges
   └─ Run flowpay:unlock for each

4. Notify customers
   └─ Resend access emails
```

────────────────────────────────────────

## Getting Help

```text
▓▓▓ SUPPORT CHANNELS
────────────────────────────────────────

1. Documentation
   └─ docs/integrations/flowpay/

2. Slack/Discord
   └─ #flowpay channel

3. GitHub Issues
   └─ https://github.com/neomello/flowpay/issues

4. Email NODE NEØ
   └─ neo@neoprotocol.space

5. Woovi Support
   └─ suporte@openpix.com.br
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Every bug is a feature waiting
 to be documented."

Debug > Despair.
────────────────────────────────────────
