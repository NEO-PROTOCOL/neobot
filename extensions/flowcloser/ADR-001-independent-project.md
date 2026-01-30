<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ADR-001 · FlowCloser as Independent
           Project
========================================
```

Date: 2026-01-30
Status: **ACCEPTED** ✅
Decider: Mellø

────────────────────────────────────────

## Context

FlowCloser Agent is in production on
Railway with automatic deploy,
established routes, and Meta API
integrations (Instagram/WhatsApp).

We considered bringing code into Neobot
monorepo ("Monorepo Modular" option),
but this presents risks.

────────────────────────────────────────

## Decision

**Keep FlowCloser as independent project.**

FlowCloser remains at:
`/Users/nettomello/CODIGOS/flowcloser-local/`

Neobot orchestrates via:

- Skills (HTTP client)
- Convenience scripts
- Well-documented ADRs

────────────────────────────────────────

## Consequences

### Positive ✅

**1. Zero risk of breaking Railway**

- Deploy continues working
- Routes preserved
- Webhooks unaffected

**2. Isolated development**

- Antigravity for FlowCloser
- Cursor for Neobot
- No conflicts

**3. Clear responsibilities**

- FlowCloser = Agent execution
- Neobot = Orchestration + Docs

**4. Future flexibility**

- Easy to scale FlowCloser
- Easy to add extensions
- Loose coupling = easy maintenance

### Negative ⚠️

**1. Documentation duplication**

- Mitigated by ADRs in Neobot
- Centralized reference docs

**2. Two repos to maintain**

- Acceptable given isolation
- Skills abstract complexity

**3. Manual synchronization**

- Skills need to know API
- Schemas help validation

────────────────────────────────────────

## Alternatives Considered

### A) Monorepo Modular

- Pros: Everything in one place
- Cons: Railway risk, Git complexity

### B) Git Subtree

- Pros: History preserved
- Cons: Sync complexity

### C) Remote Integration ← **CHOSEN**

- Pros: Isolation, safety
- Cons: Two codebases

────────────────────────────────────────

## References

- FLOWCLOSER_REMOTE_INTEGRATION.md
- Railway Docs: <https://docs.railway.app>

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
