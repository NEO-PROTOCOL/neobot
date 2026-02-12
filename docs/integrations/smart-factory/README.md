<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
   SMART FACTORY INTEGRATION · OVERVIEW
========================================
```

Tokenization-as-a-Service platform
integrated to Neobot via **nxf CLI bridge**
(loose-coupled architecture).

────────────────────────────────────────

## Architecture

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Smart Factory (8 Repositories)
┃ ░ Contracts: Hardhat + Foundry
┃ ░ UI: Nuxt PWA + Telegram miniapp
┃ ░ CLI: nxf tool (global)
┃ ░ APIs: Deploy + Compile
┃ ░ Vercel deployment (3 apps)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           │ nxf CLI + HTTP API
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Neobot (Orchestrator)
┃ ░ Skills (nxf wrappers)
┃ ░ Scripts (dashboard checks)
┃ ░ ADRs + documentation
┃ ░ Ledger audit trail
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Priority

```text
🔥 HIGH - Revenue Generator (FaaS)

Revenue Model:
- Mint fees (per token)
- White-label licensing
- Template sales
- Consulting
```

────────────────────────────────────────

## 8 Repositories

```text
▓▓▓ SMART FACTORY REPOS
────────────────────────────────────────
1. smart-core        Hardhat contracts
2. smart-ui          PWA Dashboard (Nuxt)
3. smart-cli         nxf CLI tool
4. smart-ui-mobile   Telegram miniapp
5. smart-ui-landing  Landing page
6. neo-api           Deploy/Compile API
7. forge-core        Foundry contracts
8. forge-modules     Contract templates
```

────────────────────────────────────────

## Available Skills

```bash
# Initialize token environment
moltbot factory:init

# Draft token config
moltbot factory:draft \
  --name MyToken \
  --symbol MTK \
  --supply 1000000

# Deploy token (with security simulation)
moltbot factory:deploy \
  --token MyToken

# Check factory status
moltbot factory:status

# Run diagnostics
moltbot factory:doctor
```

────────────────────────────────────────

## Convenience Scripts

```bash
# Check dashboard health
./scripts/smart-factory/check-dashboard.sh

# Test nsf CLI
./scripts/smart-factory/test-nsf-cli.sh

# Open dashboard
./scripts/smart-factory/open-dashboard.sh
```

────────────────────────────────────────

## Integration Model

**nsf CLI Bridge + HTTP APIs**

```text
Neobot Skills → nsf CLI → Smart Factory

Skills wrap nsf commands:
  moltbot factory:deploy
    └─ nsf token deploy TOKEN_NAME

Direct HTTP calls (optional):
  Dashboard API → smart-ui.vercel.app/api
```

See: [ADR-003](../../extensions/smart-factory/ADR-003-tokenization-architecture.md)

────────────────────────────────────────

## ADRs

**Architecture Decision Records:**

- [ADR-003](../../extensions/smart-factory/ADR-003-tokenization-architecture.md)
  8-repo tokenization architecture

────────────────────────────────────────

## Documentation

```text
▓▓▓ COMPLETE DOCUMENTATION
────────────────────────────────────────
└─ strategy.md        Integration approach
└─ architecture.md    System diagrams
└─ api-reference.md   CLI + API endpoints
└─ development.md     How to develop
└─ troubleshooting.md Debug guide
└─ CHANGELOG.md       Change history
```

────────────────────────────────────────

## Configuration

Integration config:
`extensions/smart-factory/integration.json`

Contains:

- 8 repository URLs
- Deployment URLs (3 Vercel apps)
- nxf CLI commands
- Network configs (Base, Polygon)
- Revenue model (FaaS)

────────────────────────────────────────

## Development Workflow

```text
▓▓▓ SMART FACTORY (8 repos)
────────────────────────────────────────
└─ Each repo has own lifecycle
└─ Independent deployments
└─ Vercel auto-deploys from Git

▓▓▓ CURSOR (Neobot)
────────────────────────────────────────
└─ Create/update skills
└─ Wrap nxf CLI commands
└─ Test via CLI
└─ Document in ADRs
```

────────────────────────────────────────

## Quick Start

**1. Install nsf CLI:**

```bash
# Clone repo
git clone https://github.com/neo-smart-token-factory/smart-cli
cd smart-cli

# Install dependencies
npm install

# Link globally
npm link
```

**2. Test nsf:**

```bash
nsf --version
nsf status
```

**3. Use skills from Neobot:**

```bash
moltbot factory:init
moltbot factory:draft --name TestToken --symbol TST
moltbot factory:deploy --token TestToken
```

**4. Check dashboard:**

```bash
./scripts/smart-factory/check-dashboard.sh
```

────────────────────────────────────────

## Deployments

```text
▓▓▓ VERCEL DEPLOYMENTS
────────────────────────────────────────

Dashboard:
  https://smart-ui-delta.vercel.app

Landing:
  https://landing-jet-seven.vercel.app

Mobile (Telegram):
  https://nuxt-app-vert.vercel.app
```

────────────────────────────────────────

## Revenue Model

**Factory-as-a-Service (FaaS):**

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ REVENUE STREAMS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. Mint Fees
┃    └─> Fee per token mint
┃        └─> Creator pays for deploy
┃
┃ 2. White-label Licensing
┃    └─> Agencies use Factory
┃        └─> Monthly/yearly subscription
┃
┃ 3. Template Sales
┃    └─> Pre-built modules
┃        └─> One-time purchase
┃
┃ 4. Consulting
┃    └─> Custom contracts
┃        └─> Integration support
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"8 repos, 1 vision.
 Tokenization for all."

Code is law. Deploy with pride.
────────────────────────────────────────
