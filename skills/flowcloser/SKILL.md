# FlowCloser Skills

Remote integration skills for FlowCloser Agent.

## Overview

FlowCloser Agent is a lead qualification agent
with Instagram DM automation, integrated to
Neobot via loose-coupled architecture.

These skills allow Neobot to orchestrate
FlowCloser without tight coupling.

## Available Commands

### Health Check

Check if FlowCloser is running (local + production).

```bash
moltbot flowcloser:health
moltbot flowcloser:health --verbose
```

### Dashboard

Open FlowCloser dashboard in browser.

```bash
# Open local dashboard
moltbot flowcloser:dashboard

# Open production dashboard
moltbot flowcloser:dashboard --production
```

### Qualify Lead

Qualify a specific lead by ID.

```bash
moltbot flowcloser:qualify --leadId=<uuid>
moltbot flowcloser:qualify --leadId=<uuid> --verbose
```

### Backup

Trigger IPFS backup (placeholder for future implementation).

```bash
moltbot flowcloser:backup
moltbot flowcloser:backup --production
```

## Integration

FlowCloser runs independently at:
- **Local:** `/Users/nettomello/CODIGOS/flowcloser-local/`
- **GitHub:** `neomello/flowcloser-agent`
- **Deploy:** Railway (auto)
- **Production:** `flowcloser-agent-production.up.railway.app`

## Documentation

Complete documentation available at:
`docs/integrations/flowcloser/`

## Configuration

Integration config:
`extensions/flowcloser/integration.json`

## Prerequisites

- FlowCloser Agent running (local or production)
- Integration config exists
- Leads data accessible

## Architecture Decision Records

- ADR-001: Why FlowCloser is independent project

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
