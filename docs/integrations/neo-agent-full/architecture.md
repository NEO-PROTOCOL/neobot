<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
   FLOWCLOSER · ARCHITECTURE
========================================
```

Complete architectural overview of
FlowCloser Agent integration.

────────────────────────────────────────

## System Overview

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ EXTERNAL SERVICES
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Meta Business API (Instagram)
┃ ░ Meta Cloud API (WhatsApp)
┃ ░ OpenAI API (GPT-4o)
┃ ░ Google AI API (Gemini 2.5 Flash)
┃ ░ Storacha (IPFS)
┃ ░ Note: IQAI discontinued (JAN 2026)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ FLOWCLOSER AGENT
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Express.js HTTP server
┃ ░ Webhook handlers
┃ ░ Agent orchestration (own AI)
┃ ░ Dual LLM system (GPT-4o + Gemini)
┃ ░ Lead qualification logic
┃ ░ SQLite persistence
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ NEOBOT
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Skills (HTTP client)
┃ ░ CLI commands
┃ ░ Convenience scripts
┃ ░ Documentation hub
┃ ░ Ledger audit
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Data Flow

```text
▓▓▓ INSTAGRAM DM → LEAD QUALIFIED
────────────────────────────────────────

1. User sends Instagram DM
   └─ "Preciso de um site"

2. Meta sends webhook to FlowCloser
   └─ POST /api/webhooks/instagram

3. FlowCloser receives message
   └─ Extracts user info

4. Agent processes with LLM
   └─ Primary: GPT-4o-mini
   └─ Fallback: Gemini 2.5 Flash

5. Lead qualification logic
   └─ Score calculation (0-100)
   └─ Project type detection
   └─ Urgency extraction

6. Lead saved to SQLite
   └─ data/flowcloser.db
   └─ data/leads.json (backup)

7. Optional: IPFS backup
   └─ Storacha upload

8. Response sent back
   └─ Meta Graph API
   └─ User receives reply
```

────────────────────────────────────────

## Components

### Main Application

```text
▓▓▓ src/main.ts (924 lines)
────────────────────────────────────────
└─ Express server setup
└─ Webhook route registration
└─ Agent initialization
└─ Database connection
└─ Middleware configuration
└─ Error handling

⚠️ WARNING: File too large!
   Recommended: Refactor into modules
```

### Agent Core

```text
▓▓▓ src/agents/flowcloser/
────────────────────────────────────────
└─ agent.ts (520L)
   Configuration & orchestration

└─ callbacks.ts
   Agent lifecycle hooks

└─ conversions.ts
   Conversion tracking (Meta Pixel)

└─ ghostwriter.ts
   Content generation

└─ logger.ts
   Structured logging

└─ tools.ts
   Agent tools/capabilities
```

### Services

```text
▓▓▓ src/services/
────────────────────────────────────────
└─ leads.ts (403L)
   Lead CRUD operations
   Score calculation
   IPFS backup
   Export functions
```

### Routes

```text
▓▓▓ src/routes/
────────────────────────────────────────
└─ legal.ts
   Privacy policy
   Terms of service

└─ data-deletion.ts
   GDPR compliance
   Data deletion requests
```

────────────────────────────────────────

## LLM Fallback System

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Message received
┗━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━
             │
             ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Try: GPT-4o-mini (Primary)
┗━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━
             │
    Success? │ Yes → Return response
             │
             │ No (timeout/error)
             ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Try: Gemini 2.5 Flash (Fallback)
┗━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━
             │
    Success? │ Yes → Return response
             │
             │ No (both failed)
             ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Error: Both LLMs failed
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Lead Scoring Algorithm

```text
▓▓▓ SCORE CALCULATION
────────────────────────────────────────
Base score:               50 points

+ Intent detected:        +10
+ Budget mentioned:       +10
+ Timeline defined:       +10
+ Pain points found:      +10
+ Manual qualification:   +10
+ Project type clear:     +5
+ Urgency (urgent):       +10
────────────────────────────────────────
Maximum possible:         100 points
Qualified threshold:      >= 60 points
```

────────────────────────────────────────

## Database Schema

### SQLite (flowcloser.db)

```sql
-- Agent sessions (managed by ADK)
-- Auto-generated schema
-- Used for conversation persistence
```

### JSON (leads.json)

```json
{
  "id": "uuid",
  "name": "string",
  "company": "string",
  "score": 0-100,
  "budget": "string",
  "qualified": boolean,
  "page_id": "string",
  "platform": "instagram|whatsapp",
  "account_name": "string",
  "user_platform_id": "string",
  "project_type": "string?",
  "urgency": "string?",
  "proposal_url": "string?",
  "status": "new|contacted|qualified...",
  "ipfs_cid": "string?",
  "created_at": "ISO",
  "updated_at": "ISO",
  "last_contact_at": "ISO?"
}
```

────────────────────────────────────────

## Security

```text
▓▓▓ SECURITY MEASURES
────────────────────────────────────────
└─ Webhook token verification
└─ HMAC signature validation
└─ Client certificate check (optional)
└─ Environment variables for secrets
└─ No secrets in code
└─ HTTPS (Railway TLS)
└─ GDPR compliance endpoints
```

────────────────────────────────────────

## Deployment

```text
▓▓▓ RAILWAY CONFIGURATION
────────────────────────────────────────
└─ Builder: Nixpacks
└─ Runtime: Node.js 20
└─ Build: npm install && npm run build
└─ Start: node dist/main.js
└─ Region: us-east4
└─ Replicas: 1
└─ Auto-deploy: On push to main
```

────────────────────────────────────────

## Monitoring

```text
▓▓▓ CURRENT STATE
────────────────────────────────────────
[####] Health endpoint ............. OK
[####] Railway logs ................ OK
[#---] APM/Tracing .............. TODO
[#---] Metrics (Prometheus) ..... TODO
[#---] Alerting (PagerDuty) ..... TODO
[----] Dashboard (Grafana) ...... TODO
```

────────────────────────────────────────

## Performance

```text
▓▓▓ BENCHMARKS (PRODUCTION)
────────────────────────────────────────
└─ Health check: ~70ms
└─ Message API: 1-3s
└─ Dashboard load: <500ms
└─ Webhook processing: <2s
└─ Uptime: 24/7
└─ Availability: 99.9%
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
