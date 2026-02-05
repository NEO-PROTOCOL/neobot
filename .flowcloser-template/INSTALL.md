# FlowCloser - Installation Guide

## Step 1: Move Template to Final Location

```bash
# Create the neo-protocol-stack directory if it doesn't exist
mkdir -p /Users/nettomello/CODIGOS/neo-protocol-stack

# Move the template
mv /Users/nettomello/CODIGOS/neobot/.flowcloser-template \
   /Users/nettomello/CODIGOS/neo-protocol-stack/flowcloser

cd /Users/nettomello/CODIGOS/neo-protocol-stack/flowcloser
```

## Step 2: Initialize Git Repository

```bash
git init
git remote add origin https://github.com/NEO-PROTOCOL/neo-node-interplanetary.git

# Optional: Fetch existing code if repo has content
# git fetch origin
# git checkout -b main origin/main || git checkout --orphan main
```

## Step 3: Install Dependencies

```bash
pnpm install
```

## Step 4: Configure Environment

```bash
cp .env.example .env

# Edit .env and set:
# - NEXUS_SECRET (same as in Nexus config)
# - WHATSAPP_SESSION_PATH (default is fine)
```

## Step 5: First Run (Local)

```bash
pnpm dev
```

**Expected Output:**
```
[FLOWCLOSER] Server running on port 3000
[FLOWCLOSER] Webhook endpoint: POST /api/webhook/nexus
[WHATSAPP] Scan QR code to connect
```

Scan the QR code with WhatsApp to authenticate.

## Step 6: Test Webhook

```bash
# In another terminal, test the webhook
curl -X POST http://localhost:3000/api/webhook/nexus \
  -H "Content-Type: application/json" \
  -H "X-Nexus-Signature: $(echo -n '{"event":"PAYMENT_RECEIVED","payload":{"payerId":"5511999999999","amount":100,"transactionId":"test-123"}}' | openssl dgst -sha256 -hmac 'your-secret-key-here' | awk '{print $2}')" \
  -d '{"event":"PAYMENT_RECEIVED","payload":{"payerId":"5511999999999","amount":100,"transactionId":"test-123"}}'
```

## Step 7: Deploy to Railway

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial FlowCloser implementation"
   git push -u origin main
   ```

2. Connect Railway to the repository
3. Set environment variables in Railway:
   - `NEXUS_SECRET`
   - `PORT` (Railway auto-assigns)
4. Deploy

## Step 8: Update Ecosystem

The ecosystem.json files have already been updated to include FlowCloser.

**Verify in Neobot:**
```bash
grep -A 10 "flowcloser" /Users/nettomello/CODIGOS/neobot/config/ecosystem.json
```

**Verify in Nexus:**
```bash
grep -A 10 "flowcloser" /Users/nettomello/CODIGOS/neo-nexus/config/nodes.json
```

---

## Architecture Summary

```
NEXUS (Orchestrator)
    │
    │ POST /api/webhook/nexus
    │ { event: "MINT_CONFIRMED", payload: {...} }
    │
    ▼
FLOWCLOSER (Notifier)
    │
    │ Validate HMAC
    │ Route Event
    │
    ▼
BAILEYS (WhatsApp)
    │
    │ Send Message
    │
    ▼
CUSTOMER (End User)
```

---

**Status:** Ready for Deployment  
**Next:** Follow steps above to install and deploy
