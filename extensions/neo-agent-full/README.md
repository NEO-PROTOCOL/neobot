<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
      FLOWCLOSER AGENT · EXTENSION
========================================
```

Lead qualification agent integrated as
remote extension (loose-coupled).

## Location

- **Local:** `flowcloser-local/`
- **Git:** <https://github.com/neomello/flowcloser-agent>
- **Deploy:** Railway (auto)
- **IDE:** Antigravity

## Integration

FlowCloser is **independent** from Neobot.

Neobot orchestrates via:

- **Skills** (HTTP client)
- **Scripts** (convenience)
- **ADRs** (documentation)

See: `docs/integrations/flowcloser/`

## Quick Commands

```bash
# Open in Antigravity
./scripts/flowcloser/open-antigravity.sh

# Health check
./scripts/flowcloser/check-health.sh

# Dashboard (local)
moltbot flowcloser:dashboard

# Dashboard (production)
moltbot flowcloser:dashboard --production=true
```

## Configuration

See: `integration.json`

## ADRs

- ADR-001: Why independent
- ADR-002: Integration strategy
- ADR-003: Railway deployment

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
