
# Changelog

All notable changes to the NEØ Protocol will be documented in this file.

## [2026.02.15] - Dynamic Nexus Reactors (Guardrails)

### Added
- **Dynamic Rules Engine:** `config/nexus-reactors.json` now controls event flow (Payment -> Mint, Notifications).
- **Circuit Breaker:** Blocks event loops deeper than 10 levels (`src/nexus/middleware.ts`).
- **Safe Mode:** Configurable allow/block lists in `config/safe-mode.json` to emergency stop the protocol.
- **Idempotency Guard:** In-memory check prevents duplicate minting for the same payment ID.
- **Template Engine:** Support for `{{token}}` replacement in action messages.

### Changed
- **Neobot Core:** Removed hardcoded `PAYMENT_RECEIVED` handler from `src/nexus/index.ts` to prevent duplicate actions.
- **Notification Logic:** Updated valid action implementation to `notify_user` with template support.
- **Terminology:** Replaced legacy "FlowCloser" references with "neo-agent-full".

### Security
- Added `runSafeHandler` wrapper to prevent single rule failures from crashing the entire process.
- Implemented Zod schema validation for all config files on boot.

### ⚠️ Deployment Notes
- This version uses in-memory idempotency. Run **MAX 1 REPLICA**.
- For multi-instance scaling, Redis migration is required for the lock mechanism.
- Check `config/safe-mode.json` on deployment to ensure `enabled: false`.
