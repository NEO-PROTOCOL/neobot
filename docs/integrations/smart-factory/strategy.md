<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  SMART FACTORY · INTEGRATION STRATEGY
         8-REPO ARCHITECTURE
========================================
```

Strategy for integrating NEO Smart Factory
with Neobot orchestration while keeping
8 repositories independent.

────────────────────────────────────────

## Philosophy

```text
╔═══════════════════════════════════════╗
║ 8 Repos, 1 Vision.                    ║
║                                       ║
║ Tokenization for All.                 ║
║                                       ║
║ Orchestration, Not Fusion.            ║
╚═══════════════════════════════════════╝
```

────────────────────────────────────────

## Integration Model

**nxf CLI Bridge + HTTP APIs**

```text
Smart Factory (8 Repos)      Neobot
(Independent)                (Orchestrator)
─────────────────────────────────────────────
📍 8 GitHub repositories     📍 /CODIGOS/neobot/
🚀 Vercel deploys (3 apps)   📚 ADRs + Docs
🔧 Multiple IDEs             🔧 Cursor IDE
💾 Independent lifecycles    🔗 Skills (wrappers)
🌐 nxf CLI tool              🎯 Orchestration
📊 Full tech stack           📖 Documentation
──────────────────────────────────────────────
         ↕️ nxf CLI + HTTP
         ↕️ Skills orchestration
```

────────────────────────────────────────

## Why 8 Repositories?

### Separation of Concerns

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ REPO STRATEGY
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. smart-core (Contracts)
┃    └─> Hardhat tooling
┃        └─> Deploy scripts
┃
┃ 2. forge-core + forge-modules
┃    └─> Foundry alternative
┃        └─> Gas optimization
┃
┃ 3. smart-ui (Dashboard)
┃    └─> Nuxt PWA
┃        └─> Web3 integration
┃
┃ 4. smart-ui-mobile (Telegram)
┃    └─> Mobile-first
┃        └─> Bot integration
┃
┃ 5. smart-ui-landing (Marketing)
┃    └─> Lead capture
┃        └─> Product info
┃
┃ 6. neo-api (Backend)
┃    └─> Compilation API
┃        └─> Deploy orchestration
┃
┃ 7. smart-cli (nxf)
┃    └─> Developer experience
┃        └─> CLI tool
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Benefits:**

- ✅ Independent deployments
- ✅ Tech stack flexibility
- ✅ Team parallelization
- ✅ Clear ownership
- ✅ Vercel optimization per app

────────────────────────────────────────

## Technical Strategy

### 1. Skills as nsf Wrappers

```text
▓▓▓ NEOBOT SKILLS (5 core)
────────────────────────────────────────

factory:init
  └─ Wraps: nsf init
  └─ Returns: initialized environment
  └─ Ledger: Record initialization

factory:draft
  └─ Wraps: nsf token draft
  └─ Returns: token config file
  └─ Ledger: Record draft creation

factory:deploy
  └─ Wraps: nsf token deploy TOKEN_NAME
  └─ Returns: contract address + security report
  └─ Ledger: Record deployment

factory:status
  └─ Wraps: nsf status
  └─ Returns: factory progress + health
  └─ Ledger: Record status query

factory:doctor
  └─ Wraps: nsf doctor
  └─ Returns: diagnostic report
  └─ Ledger: Record health check
```

### 2. nsf CLI Integration

```text
▓▓▓ NSF CLI BRIDGE
────────────────────────────────────────

Install (Dev Mode):
  git clone https://github.com/neo-smart-token-factory/smart-cli
  cd smart-cli && npm install && npm link

Commands (v0.5.3):
  nsf init           Initialize token environment
  nsf token draft    Create token config
  nsf token deploy   Deploy with security simulation
  nsf token forge    Deploy to production
  nsf simulate       Run security/econ/risk simulation
  nsf doctor         Diagnostic + audit
  nsf marketing      Generate narrative content
  nsf status         Check factory progress

Neobot wraps core commands:
  moltbot factory:deploy
    └─> Internally: nsf token deploy ...
        └─> Includes security validation
        └─> Records in Ledger
```

### 3. Independence Maintained

```text
▓▓▓ WHAT STAYS SEPARATE
────────────────────────────────────────

Smart Factory:
  ✅ 8 repos (intact)
  ✅ Vercel deploys (preserved)
  ✅ nsf CLI (independent tool)
  ✅ Contracts (full codebase)
  ✅ UI/UX (Smart Factory owns)

Neobot:
  ✅ Skills (CLI wrappers only)
  ✅ Scripts (dashboard checks)
  ✅ ADRs + Documentation
  ✅ Ledger audit trail
  ✅ No Smart Factory business logic
```

────────────────────────────────────────

## Revenue Strategy

### Factory-as-a-Service (FaaS)

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ REVENUE STREAMS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Mint Fees
┃    └─> Fee per token mint
┃        └─> e.g., 0.01 ETH per 1000 tokens
┃
┃ 2. White-label Licensing
┃    └─> Agencies license Smart Factory
┃        └─> Monthly: $500/mo
┃        └─> Yearly: $5,000/yr
┃
┃ 3. Template Sales
┃    └─> Pre-built contract modules
┃        └─> $50-$500 per template
┃
┃ 4. Consulting
┃    └─> Custom contract development
┃        └─> $2,000-$10,000 per project
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Revenue Impact:**

```text
▓▓▓ REVENUE IMPACT
────────────────────────────────────────

Smart Factory = HIGH PRIORITY 🔥

Blocks:
  └─ Agency income (tokenization services)
  └─ Product revenue (WOD, FLUXX, etc)
  └─ Consulting pipeline

Target (Q1 2026):
  └─ 10+ tokens deployed
  └─ R$5,000+ FaaS revenue
  └─ 1 white-label client
```

────────────────────────────────────────

## Data Flow Strategy

### 1. Developer Journey

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ DEVELOPER PERSPECTIVE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Install nsf CLI
┃    └─ git clone + npm install + npm link
┃
┃ 2. Initialize environment
┃    └─ moltbot factory:init
┃
┃ 3. Draft token config
┃    └─ moltbot factory:draft \
┃         --name MyToken \
┃         --symbol MTK \
┃         --supply 1000000
┃
┃ 4. Deploy contract (with security)
┃    └─ moltbot factory:deploy --token MyToken
┃        └─> Security simulation runs
┃        └─> Auto-blocks if critical risk
┃
┃ 5. Contract deployed on Base
┃    └─ Returns: 0x1234...abcd
┃
┃ 6. Check status
┃    └─ moltbot factory:status
┃        └─> Shows factory progress
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. System Perspective

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ SYSTEM DATA FLOW
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ Neobot:
┃ └─ Receives CLI command
┃ └─ Calls nxf CLI wrapper
┃ └─ Captures output
┃ └─ Records in Ledger
┃
┃ nxf CLI:
┃ └─ Compiles contract (Hardhat/Foundry)
┃ └─ Deploys to network (Base/Polygon)
┃ └─ Returns contract address
┃ └─ Optionally verifies on explorer
┃
┃ Smart Factory UIs:
┃ └─ Dashboard shows deployed contracts
┃ └─ Mobile app for quick actions
┃ └─ Landing captures leads
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Development Strategy

### Phase 1: CLI Integration (Week 1)

```text
[####] nxf CLI installed globally
[####] integration.json configured
[####] ADR-003 written
[##--] Skills created (deploy, mint, verify, status)
```

### Phase 2: Testing (Week 2)

```text
[##--] Test deploy on Base testnet
[##--] Test mint
[#---] Test verify on BaseScan
[#---] Scripts (check-dashboard, test-nxf-cli)
```

### Phase 3: Production (Week 3)

```text
[#---] First real deploy (mainnet)
[#---] 1 client token deployed
[#---] Ledger recording all actions
[----] Dashboard integration
```

### Phase 4: Scale (Month 2-3)

```text
[----] 10+ tokens deployed
[----] White-label client
[----] Template marketplace
[----] Consulting pipeline
```

────────────────────────────────────────

## Risk Mitigation

```text
▓▓▓ RISKS & MITIGATIONS
────────────────────────────────────────

Risk: nxf CLI breaks
  └─ Mitigation: Pin version in integration.json
  └─ Mitigation: Test before upgrading

Risk: Vercel deploy fails
  └─ Mitigation: Multiple Vercel projects
  └─ Mitigation: Independent deploys

Risk: Gas fees too high
  └─ Mitigation: Use Base (L2, cheap)
  └─ Mitigation: Gas optimizer in Foundry

Risk: Contract bug
  └─ Mitigation: OpenZeppelin audited contracts
  └─ Mitigation: Foundry formal verification
  └─ Mitigation: Test coverage > 90%

Risk: 8 repos out of sync
  └─ Mitigation: integration.json maps all
  └─ Mitigation: Monorepo NOT needed
  └─ Mitigation: Clear versioning
```

────────────────────────────────────────

## Success Criteria

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ INTEGRATION COMPLETE WHEN:
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✅ nsf CLI installed (npm link)
┃ ✅ Skills working (init, draft, deploy, status, doctor)
┃ ✅ Security simulation active
┃ ✅ 1 test deploy on Base testnet
┃ ✅ 1 real deploy on Base mainnet
┃ ✅ Ledger recording all actions
┃ ✅ Documentation complete
┃ ✅ ADR-003 written
┃ ✅ Scripts functional
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## References

- [ADR-003](../../extensions/smart-factory/ADR-003-tokenization-architecture.md)
- [architecture.md](./architecture.md)
- Smart Factory GitHub Org: neo-smart-token-factory

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"8 repos unified by vision,
 not by folder structure."

Orchestration > Monolith.
────────────────────────────────────────
