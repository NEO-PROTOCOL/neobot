<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
   FLOWCLOSER INTEGRATION · OVERVIEW
========================================
```

Lead qualification agent integrated to
Neobot via **Remote Integration**
(loose-coupled architecture).

────────────────────────────────────────

## Architecture

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowCloser Agent (Independent)
┃ ░ Antigravity IDE
┃ ░ Lead qualification
┃ ░ Instagram DM automation
┃ ░ WhatsApp API integration
┃ ░ SQLite database
┃ ░ Railway deployment
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           │ HTTP API
           │ Filesystem
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Neobot (Orchestrator)
┃ ░ Cursor IDE
┃ ░ Skills (HTTP client)
┃ ░ Convenience scripts
┃ ░ ADRs + documentation
┃ ░ Ledger audit trail
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Location

```text
▓▓▓ FLOWCLOSER PATHS
────────────────────────────────────────
└─ Local: /CODIGOS/flowcloser-local/
└─ GitHub: neomello/flowcloser-agent
└─ Railway: flowcloser-agent-production
             .up.railway.app
└─ IDE: Antigravity
```

────────────────────────────────────────

## Available Skills

```bash
# Qualify lead
moltbot flowcloser:qualify --leadId=abc123

# Open dashboard (local)
moltbot flowcloser:dashboard

# Open dashboard (production)
moltbot flowcloser:dashboard --production=true

# Health check
moltbot flowcloser:health

# Backup to IPFS
moltbot flowcloser:backup
```

────────────────────────────────────────

## Convenience Scripts

```bash
# Open in Antigravity
./scripts/flowcloser/open-antigravity.sh

# Health check
./scripts/flowcloser/check-health.sh

# Tail Railway logs
./scripts/flowcloser/tail-logs.sh

# Backup database
./scripts/flowcloser/backup-db.sh
```

────────────────────────────────────────

## ADRs

**Architecture Decision Records:**

- [ADR-001](../../extensions/flowcloser/ADR-001-independent-project.md)
  Why independent project
- [ADR-002](#) Integration strategy
  *(coming soon)*
- [ADR-003](#) Railway deployment
  *(coming soon)*

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
```

────────────────────────────────────────

## Configuration

Integration config:
`extensions/flowcloser/integration.json`

Contains:

- Endpoints
- Data paths
- IDE settings
- Repository URLs

────────────────────────────────────────

## Development Workflow

```text
▓▓▓ ANTIGRAVITY (FlowCloser)
────────────────────────────────────────
└─ Make changes in agent
└─ Test locally
└─ Commit to flowcloser-agent
└─ Railway auto-deploys

▓▓▓ CURSOR (Neobot)
────────────────────────────────────────
└─ Create/update skills
└─ Test via CLI
└─ Commit to neobot
└─ Skills available
```

────────────────────────────────────────

## Quick Start

**1. Open FlowCloser in Antigravity:**

```bash
./scripts/flowcloser/open-antigravity.sh
```

**2. Check health:**

```bash
./scripts/flowcloser/check-health.sh
```

**3. Use skills from Neobot:**

```bash
moltbot flowcloser:dashboard
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
