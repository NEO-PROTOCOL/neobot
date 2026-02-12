<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# Railway Deployment - Info Location

```text
========================================
  24/7 DEPLOYMENT REFERENCES
========================================
```

────────────────────────────────────────
Documentation Locations
────────────────────────────────────────

## 1. Primary Documentation

**File:** `docs/railway.mdx`

```text
▓▓▓ CONTENT
────────────────────────────────────────
• One-click deploy template
• Volume configuration (/data)
• Environment variables
• Backup/export process
• Required Railway settings
```

**Key Info:**

```text
Port: 8080
Volume: /data
Variables:
  - GATEWAY_PASSWORD (required)
  - PORT=8080
  - CLAWDBOT_STATE_DIR=/data/.clawdbot
  - CLAWDBOT_WORKSPACE_DIR=/data/workspace
  - GATEWAY_TOKEN
```

## 2. Active Deployment (FlowCloser)

**File:** `AUDIT_EVOLUTION_VS_FLOWCLOSER.md`

```text
▓▓▓ FLOWCLOSER RAILWAY
────────────────────────────────────────
URL: flowcloser-agent-production
     .up.railway.app

Project ID:
  95ed3bcd-2e20-4477-b50c-43cd9ec04c41

Service ID:
  78c16321-326e-4f02-a808-65da3344a989

Environment ID:
  6f1a6dd0-9760-4ad8-9cb3-f690d2575408

Function: External Services Bridge
```

## 3. Alternative: Render

**File:** `render.yaml`

```yaml
services:
  - type: web
    name: moltbot
    runtime: docker
    plan: starter
    healthCheckPath: /health
    envVars:
      - key: PORT
        value: "8080"
      - key: CLAWDBOT_STATE_DIR
        value: /data/.clawdbot
    disk:
      name: moltbot-data
      mountPath: /data
      sizeGB: 1
```

## 4. Other Deployment Options

**Files:**
- `fly.toml` - Fly.io configuration
- `docs/install/ansible.md` - Ansible deployment
- `docs/vps.md` - VPS deployment

────────────────────────────────────────
Railway Setup Process
────────────────────────────────────────

```text
▓▓▓ STEP 1: DEPLOY
────────────────────────────────────────
1. Click "Deploy on Railway" button
2. Select repository
3. Railway auto-detects Dockerfile
4. Creates service + environment

▓▓▓ STEP 2: CONFIGURE
────────────────────────────────────────
1. Add Volume: /data (1GB+)
2. Set PORT: 8080
3. Enable HTTP Proxy
4. Set GATEWAY_PASSWORD
5. Set GATEWAY_TOKEN

▓▓▓ STEP 3: CONFIGURE
────────────────────────────────────────
1. Access: https://<domain>/moltbot
2. Authorize with GATEWAY_PASSWORD
3. Configure model/provider in settings
4. Add channel tokens

▓▓▓ STEP 4: VERIFY
────────────────────────────────────────
1. Health: https://<domain>/health
2. Control UI: https://<domain>/moltbot
3. Test message send
4. Verify channels connected
```

────────────────────────────────────────
24/7 Operation
────────────────────────────────────────

**Railway Features:**

```text
✓ Auto-restart on crash
✓ Persistent storage (Volume)
✓ Zero-downtime deploys
✓ Automatic HTTPS
✓ Custom domains
✓ Health checks
✓ Metrics & logs
✓ Horizontal scaling (paid)
```

**Monitoring:**

```text
Gateway logs:
  → Railway → Service → Logs

Health endpoint:
  → https://<domain>/health

Status command:
  → moltbot status --deep

Session store:
  → /data/.clawdbot/agents/main/
     sessions/sessions.json
```

────────────────────────────────────────
Backup & Migration
────────────────────────────────────────

**Export State:**

```bash
# Via web (Control UI)
https://<domain>/moltbot/settings/export

# Via CLI (if SSH enabled)
moltbot backup export
```

**Files Included:**

```text
/data/.clawdbot/
  ├── moltbot.json (config)
  ├── credentials/ (tokens)
  ├── agents/main/
  │   └── sessions/sessions.json
  └── workspace/
```

**Restore on New Host:**

```bash
# 1. Deploy new Railway instance
# 2. Upload backup to /data
# 3. Restart service
moltbot doctor
```

────────────────────────────────────────
Cost Estimation (Railway)
────────────────────────────────────────

```text
▓▓▓ STARTER PLAN
────────────────────────────────────────
Base: $5/month
  └─> Includes $5 usage credit

Usage (typical):
  • Small traffic: ~$3-5/month
  • Medium traffic: ~$10-15/month
  • High traffic: ~$20-30/month

Storage (Volume):
  • 1GB: Free
  • 10GB: ~$1/month
  • 100GB: ~$10/month

Total estimate: $5-20/month
```

────────────────────────────────────────
Related Files
────────────────────────────────────────

```text
Deployment:
  docs/railway.mdx
  render.yaml
  fly.toml
  Dockerfile
  docker-setup.sh

Audit:
  AUDIT_EVOLUTION_VS_FLOWCLOSER.md
  AUDIT_FLOWPAY.md

Config:
  config/neobot.runtime.json
  .github/workflows/*.yml
```

────────────────────────────────────────
Notion References
────────────────────────────────────────

**Search Keywords:**
- "railway"
- "deployment"
- "24/7"
- "production"
- "flowcloser"

**Likely Locations:**
- Work Log entries
- NΞØ Command Center
- Infrastructure pages
- Deployment guides

────────────────────────────────────────
Next Steps (When Ready)
────────────────────────────────────────

```text
1. Review docs/railway.mdx
2. Check FlowCloser Railway status
3. Verify environment variables
4. Test health endpoint
5. Monitor logs
6. Setup backup automation
```

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"24/7 uptime is not a feature.
 It's a requirement."

Deploy once. Run forever.
────────────────────────────────────────
