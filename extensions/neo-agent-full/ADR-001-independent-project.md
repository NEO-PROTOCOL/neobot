<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ADR-001 · FLOWCLOSER INDEPENDENT
========================================
```

**Status:** ACCEPTED ✅  
**Date:** 2026-01-30  
**Decider:** NODE NEØ (Node Architect)

────────────────────────────────────────

## CONTEXT

FlowCloser Agent is operational on Railway
with automatic deployment, established
routes, and Meta API integration
(Instagram/WhatsApp).

We considered bringing the code into the
Neobot monorepo ("Modular Monorepo"
option), but this presents risks.

────────────────────────────────────────

## DECISION

**Keep FlowCloser as independent project.**

FlowCloser remains at:
`/Users/nettomello/CODIGOS/flowcloser-local/`

Neobot orchestrates via:
- Skills (HTTP client)
- Convenience scripts
- Well-documented ADRs

────────────────────────────────────────

## CONSEQUENCES

### Positive ✅

1. **Zero risk of breaking Railway**
   - Deploy continues working
   - Routes preserved
   - Webhooks unaffected

2. **Isolated development**
   - Antigravity for FlowCloser
   - Cursor for Neobot
   - No conflicts

3. **Clear responsibilities**
   - FlowCloser = Agent execution
   - Neobot = Orchestration + Docs

4. **Future flexibility**
   - Easy to scale FlowCloser
   - Easy to add other extensions
   - Loose coupling = easy maintenance

### Negative ⚠️

1. **Documentation duplication**
   - Mitigated by ADRs in Neobot
   - Centralized reference docs

2. **Two repos to maintain**
   - Acceptable given isolation
   - Skills abstract complexity

3. **Manual synchronization**
   - Skills need to know API
   - Schemas help validation

────────────────────────────────────────

## ALTERNATIVES CONSIDERED

### A) Modular Monorepo
- Pros: Everything in one place
- Cons: Railway risk, Git complexity

### B) Git Subtree
- Pros: History preserved
- Cons: Sync complexity

### C) Remote Integration ← CHOSEN
- Pros: Isolation, security
- Cons: Two codebases

────────────────────────────────────────

## REFERENCES

- `docs/integrations/flowcloser/strategy.md`
- `docs/integrations/flowcloser/architecture.md`
- Railway Docs: https://docs.railway.app

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
