<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
       SMART FACTORY · CHANGELOG
========================================
```

Release history and notable changes
across 8 repositories.

────────────────────────────────────────

## [Unreleased]

### Planned

- Recurring token airdrops
- Multi-sig wallet support
- Advanced analytics dashboard
- Template marketplace
- Mobile app (native)

────────────────────────────────────────

## [1.0.0] - 2026-01-30

**Integration with Neobot**

### Added

- ✅ Neobot skills (deploy, mint, verify, status)
- ✅ integration.json (8-repo map)
- ✅ ADR-003 (Tokenization architecture)
- ✅ Complete documentation (7 files)
- ✅ Scripts (check-dashboard, test-nxf-cli)
- ✅ Ledger audit trail integration

### Changed

- nxf CLI now wrapped by Neobot skills
- Updated architecture diagrams
- Consolidated documentation in Neobot

────────────────────────────────────────

## [0.9.0] - 2025-12-15

**Production Ready (8 Repos)**

### Added

- smart-core: Hardhat contracts (ERC20, ERC721, ERC1155)
- smart-ui: PWA Dashboard (Nuxt)
- smart-cli: nxf CLI tool (TypeScript)
- smart-ui-mobile: Telegram miniapp
- smart-ui-landing: Landing page
- neo-api: Deploy/Compile API
- forge-core: Foundry contracts
- forge-modules: Contract templates

### Deployments

- smart-ui: smart-ui-delta.vercel.app
- smart-ui-mobile: nuxt-app-vert.vercel.app
- smart-ui-landing: landing-jet-seven.vercel.app

────────────────────────────────────────

## [0.8.0] - 2025-11-10

**nxf CLI Beta**

### Added

- nxf deploy command
- nxf mint command
- nxf burn command
- nxf verify command
- nxf status command

### Changed

- Improved error messages
- Better gas estimation
- Auto RPC fallback

────────────────────────────────────────

## [0.7.0] - 2025-10-20

**Foundry Integration**

### Added

- forge-core repository
- forge-modules repository
- Gas optimization tests
- Formal verification support

### Performance

- 30% gas reduction on ERC20
- 40% faster tests (Foundry vs Hardhat)

────────────────────────────────────────

## [0.6.0] - 2025-09-15

**Dashboard MVP**

### Added

- smart-ui repository
- Nuxt 3 PWA
- Web3Auth integration
- Contract deployment wizard
- Token admin panel

### Deployments

- Vercel: smart-ui-delta.vercel.app

────────────────────────────────────────

## [0.5.0] - 2025-08-10

**Mobile Support**

### Added

- smart-ui-mobile repository
- Telegram Bot integration
- Mobile-first UI
- Quick mint/burn actions

### Deployments

- Vercel: nuxt-app-vert.vercel.app
- Ready for BotFather registration

────────────────────────────────────────

## [0.4.0] - 2025-07-05

**Backend API**

### Added

- neo-api repository
- Compilation API
- Deploy orchestration API
- Metadata management

────────────────────────────────────────

## [0.3.0] - 2025-06-01

**Landing Page**

### Added

- smart-ui-landing repository
- Marketing content
- Lead capture form
- Documentation links

### Deployments

- Vercel: landing-jet-seven.vercel.app

────────────────────────────────────────

## [0.2.0] - 2025-05-01

**Contract Templates**

### Added

- forge-modules repository
- ERC20WithStaking template
- ERC721WithRoyalties template
- GovernanceToken template
- VestingWallet template

────────────────────────────────────────

## [0.1.0] - 2025-04-01

**Initial Release (smart-core)**

### Added

- Hardhat setup
- ERC20 base contract
- ERC721 base contract
- Deploy scripts
- Test suite

────────────────────────────────────────

## Version History

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VERSION    DATE        MILESTONE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 1.0.0      2026-01-30  Neobot Integration
┃ 0.9.0      2025-12-15  8 Repos Production
┃ 0.8.0      2025-11-10  nxf CLI Beta
┃ 0.7.0      2025-10-20  Foundry Integration
┃ 0.6.0      2025-09-15  Dashboard MVP
┃ 0.5.0      2025-08-10  Mobile Support
┃ 0.4.0      2025-07-05  Backend API
┃ 0.3.0      2025-06-01  Landing Page
┃ 0.2.0      2025-05-01  Contract Templates
┃ 0.1.0      2025-04-01  Initial Release
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Upcoming Features

### Q1 2026 (Jan-Mar)

- [ ] First real client deploy
- [ ] 10+ tokens deployed
- [ ] White-label licensing (1 client)
- [ ] Template marketplace beta
- [ ] Advanced analytics

### Q2 2026 (Apr-Jun)

- [ ] Multi-sig wallet support
- [ ] Recurring airdrops
- [ ] DAO governance templates
- [ ] Native mobile app
- [ ] API rate limit increase

### Q3 2026 (Jul-Sep)

- [ ] Cross-chain support (10+ chains)
- [ ] NFT marketplace integration
- [ ] Advanced DeFi templates
- [ ] Audit service integration
- [ ] Enterprise features

### Q4 2026 (Oct-Dec)

- [ ] Layer 3 support
- [ ] Zero-knowledge proofs
- [ ] AI-powered contract generation
- [ ] Decentralized governance
- [ ] Global expansion

────────────────────────────────────────

## Breaking Changes

### 1.0.0 → 2.0.0 (Future)

TBD. Backwards compatible planned.

### 0.9.0 → 1.0.0

No breaking changes. Neobot integration
is additive (skills + documentation).

────────────────────────────────────────

## Migration Guides

### From 0.9.0 to 1.0.0

No migration needed. Smart Factory
continues working independently.

Neobot integration is optional:

```bash
# Use nxf directly (as before)
nxf deploy --name MyToken --symbol MTK --supply 1000

# Or use Neobot skills (new)
moltbot factory:deploy --name MyToken --symbol MTK --supply 1000
```

────────────────────────────────────────

## Credits

**Core Contributors:**

- NODE NEØ (Node Architect) - Architecture, Integration
- NEØ Protocol Community - Testing, Feedback

**Special Thanks:**

- Vercel - Hosting platform
- OpenZeppelin - Audited contracts
- Hardhat - Development framework
- Foundry - Testing framework
- Base - L2 network
- Polygon - L2 network
- QuickNode - RPC services

────────────────────────────────────────

## License

Private - NEØ Protocol  
Copyright © 2025-2026 NODE NEØ

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"8 repos, infinite iterations."

Every release is evolution.
────────────────────────────────────────
