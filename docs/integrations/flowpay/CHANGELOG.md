<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
         FLOWPAY · CHANGELOG
========================================
```

Release history and notable changes.

────────────────────────────────────────

## [Unreleased]

### Added

- Token materialization background job
- Email/SMS notifications
- Multi-product support
- Recurring payments (planned)

### Changed

- None

### Fixed

- None

────────────────────────────────────────

## [2.2.0] - 2026-01-30

**Integration with Neobot (7-Day Mission)**

### Added

- ✅ Neobot skills (buy, status, unlock)
- ✅ UNLOCK_RECEIPT generator
- ✅ JWT token authentication
- ✅ Webhook auto-unlock
- ✅ Ledger audit trail
- ✅ Complete documentation (7 files)
- ✅ ADR-002 (Access Unlock Primary)
- ✅ Scripts (check-health, run-local, test-webhook)

### Changed

- Integration model: Model B (Access Unlock Primary)
- Token now invisible ledger (not primary value)
- Updated architecture diagrams

### Fixed

- Webhook signature validation
- JWT expiration handling
- QR code display on mobile

────────────────────────────────────────

## [2.1.0] - 2026-01-15

**Astro Migration Complete**

### Added

- Astro framework (replacing Next.js)
- SSR support (Netlify)
- API routes (/api/charges, /api/webhooks)
- Netlify Functions (serverless)

### Changed

- Moved from Next.js to Astro
- 208 files migrated
- Build time reduced by 40%
- Bundle size reduced by 30%

### Removed

- Next.js dependencies
- Vercel deployment config

────────────────────────────────────────

## [2.0.0] - 2025-12-20

**Production Ready**

### Added

- Woovi/OpenPix integration (PIX)
- Web3Auth wallet connection
- QuickNode RPC (Base, Polygon)
- Product pages (Smart Factory, WOD, FLUXX)
- Checkout flow
- QR code generation

### Changed

- Renamed from "FlowPayPIX" to "FlowPay"
- Updated branding

### Security

- HTTPS only (Netlify TLS)
- Webhook signature validation
- JWT token expiration (90 days)
- Environment variable protection

────────────────────────────────────────

## [1.5.0] - 2025-11-10

**MVP Testing**

### Added

- PIX charge creation
- Status checking
- Manual webhook testing
- ngrok integration

### Fixed

- Webhook payload parsing
- CORS issues
- Mobile QR code scanning

────────────────────────────────────────

## [1.0.0] - 2025-10-01

**Initial Release**

### Added

- Basic Astro setup
- Homepage
- Checkout page prototype
- Woovi API client
- Environment configuration

────────────────────────────────────────

## Version History

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VERSION    DATE        MILESTONE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 2.2.0      2026-01-30  Neobot Integration
┃ 2.1.0      2026-01-15  Astro Migration
┃ 2.0.0      2025-12-20  Production Ready
┃ 1.5.0      2025-11-10  MVP Testing
┃ 1.0.0      2025-10-01  Initial Release
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Upcoming Features

### Q1 2026 (Jan-Mar)

- [ ] First real sale (DAY 7) 🎯
- [ ] 10+ products integrated
- [ ] Email/SMS notifications
- [ ] Customer dashboard
- [ ] Token materialization background job

### Q2 2026 (Apr-Jun)

- [ ] Recurring payments (subscriptions)
- [ ] Multi-currency support (USD, EUR)
- [ ] Affiliate system
- [ ] API webhooks for partners
- [ ] Mobile app (PWA)

### Q3 2026 (Jul-Sep)

- [ ] Credit card support (Stripe)
- [ ] Boleto support
- [ ] Invoice generation
- [ ] Analytics dashboard
- [ ] A/B testing

### Q4 2026 (Oct-Dec)

- [ ] White-label licensing
- [ ] Multi-tenant support
- [ ] Advanced fraud detection
- [ ] International expansion

────────────────────────────────────────

## Breaking Changes

### 2.2.0 → 3.0.0 (Future)

None planned. Backwards compatible.

### 2.1.0 → 2.2.0

None. Skills added, no breaking changes.

### 2.0.0 → 2.1.0

- Next.js → Astro migration
- API endpoints changed
- `/pages/` → `/src/pages/`

────────────────────────────────────────

## Migration Guides

### From 2.1.0 to 2.2.0

No migration needed. Neobot integration
is additive (skills + documentation).

FlowPay continues working independently.

### From 2.0.0 to 2.1.0

```bash
# 1. Update dependencies
pnpm install

# 2. Migrate pages to src/
mv pages src/

# 3. Update astro.config.mjs
# (See migration guide in repo)

# 4. Test locally
pnpm dev

# 5. Deploy
git push origin main
```

────────────────────────────────────────

## Credits

**Core Contributors:**

- NODE NEØ (Node Architect) - Architecture, Integration
- Woovi Team - PIX API support
- NEØ Protocol Community - Testing, Feedback

**Special Thanks:**

- Netlify - Hosting platform
- Web3Auth - Wallet infrastructure
- QuickNode - RPC services
- OpenClaw - Neobot foundation

────────────────────────────────────────

## License

Private - NEØ Protocol  
Copyright © 2025-2026 NODE NEØ

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Every release is a step towards
 the revenue loop closing."

Ship > Perfect. Always.
────────────────────────────────────────
