<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
      SMART FACTORY · ARCHITECTURE
========================================
```

Complete architectural overview of
NEO Smart Factory (8-repo system).

────────────────────────────────────────

## System Overview

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ BLOCKCHAIN NETWORKS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Base (L2)
┃ ░ Polygon (L2)
┃ ░ QuickNode RPC
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ SMART FACTORY (8 REPOS)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Contracts: smart-core, forge-core
┃ ░ UIs: smart-ui, mobile, landing
┃ ░ CLI: nxf tool (smart-cli)
┃ ░ APIs: neo-api
┃ ░ Templates: forge-modules
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ NEOBOT
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Skills (nxf wrappers)
┃ ░ Scripts (dashboard checks)
┃ ░ Documentation hub
┃ ░ Ledger audit
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## 8 Repositories Breakdown

### 1. smart-core (Hardhat)

```text
▓▓▓ SMART-CORE
────────────────────────────────────────
Tech: Hardhat, Solidity, TypeScript
Deploy: Base, Polygon
Status: Active

Purpose:
  └─ Main contract development
  └─ ERC-20, ERC-721, ERC-1155
  └─ Deploy scripts
  └─ Test suite

Structure:
contracts/
├── Token.sol            ERC-20 base
├── NFT.sol              ERC-721 base
├── MultiToken.sol       ERC-1155 base
└── modules/             Extensions
    ├── Staking.sol
    ├── Governance.sol
    └── Vesting.sol

scripts/
├── deploy-token.ts
├── deploy-nft.ts
└── verify.ts

test/
└── Token.test.ts
```

### 2. smart-ui (PWA Dashboard)

```text
▓▓▓ SMART-UI
────────────────────────────────────────
Tech: Nuxt, Vue, Pinia
Deploy: Vercel (smart-ui-delta.vercel.app)
Status: Active

Purpose:
  └─ Token management dashboard
  └─ Deploy UI
  └─ Mint/burn/transfer UI
  └─ Analytics

Features:
  └─ Wallet connect (Web3Auth)
  └─ Contract deployment wizard
  └─ Token admin panel
  └─ Transaction history
  └─ Gas optimizer
```

### 3. smart-cli (nxf tool)

```text
▓▓▓ SMART-CLI (nxf)
────────────────────────────────────────
Tech: TypeScript, Commander.js
Install: npm install -g @neo-smart-factory/cli
Status: Active

Purpose:
  └─ CLI tool for developers
  └─ Deploy contracts
  └─ Mint tokens
  └─ Verify on explorers

Commands:
  nxf deploy     Deploy contract
  nxf mint       Mint tokens
  nxf burn       Burn tokens
  nxf transfer   Transfer tokens
  nxf verify     Verify on explorer
  nxf status     Check contract status
```

### 4. smart-ui-mobile (Telegram)

```text
▓▓▓ SMART-UI-MOBILE
────────────────────────────────────────
Tech: Nuxt, Telegram Bot API
Deploy: Vercel (nuxt-app-vert.vercel.app)
Status: Active, Ready for BotFather

Purpose:
  └─ Telegram miniapp
  └─ Mobile-first token mgmt
  └─ Quick mint/burn
  └─ Portfolio view

Integration:
  └─ BotFather registration pending
  └─ Web App URL ready
  └─ Inline keyboard UI
```

### 5. smart-ui-landing

```text
▓▓▓ SMART-UI-LANDING
────────────────────────────────────────
Tech: Nuxt
Deploy: Vercel (landing-jet-seven.vercel.app)
Status: Active

Purpose:
  └─ Marketing landing page
  └─ Product info
  └─ Lead capture
  └─ Documentation links
```

### 6. neo-api

```text
▓▓▓ NEO-API
────────────────────────────────────────
Tech: Node.js, Express
Deploy: Vercel (serverless)
Status: Active

Purpose:
  └─ Backend for smart-ui
  └─ Contract compilation API
  └─ Deploy orchestration
  └─ Metadata management

Endpoints:
  POST /api/compile    Compile Solidity
  POST /api/deploy     Deploy contract
  GET  /api/metadata   Get token metadata
  POST /api/verify     Verify on explorer
```

### 7. forge-core

```text
▓▓▓ FORGE-CORE
────────────────────────────────────────
Tech: Foundry, Solidity
Status: Active

Purpose:
  └─ Alternative to Hardhat
  └─ Gas-optimized contracts
  └─ Advanced testing (Foundry)
  └─ Formal verification

Why Foundry?
  └─ Faster tests (Rust-based)
  └─ Better gas reports
  └─ Native Solidity tests
```

### 8. forge-modules

```text
▓▓▓ FORGE-MODULES
────────────────────────────────────────
Tech: Foundry
Status: Active

Purpose:
  └─ Pre-built contract modules
  └─ Composable extensions
  └─ Template library

Modules:
  └─ ERC20WithStaking.sol
  └─ ERC721WithRoyalties.sol
  └─ GovernanceToken.sol
  └─ VestingWallet.sol
```

────────────────────────────────────────

## Data Flow

### Deploy Flow

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 1. Developer runs command
┃    └─> moltbot factory:deploy
┃        └─> Neobot skill triggered
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 2. Neobot calls nxf CLI
┃    └─> nxf deploy --name MyToken
┃        └─> smart-cli package
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 3. nxf compiles contract
┃    └─> Hardhat or Foundry
┃        └─> Outputs bytecode + ABI
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 4. nxf deploys to network
┃    └─> Base or Polygon
┃        └─> Via QuickNode RPC
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 5. Contract on-chain
┃    └─> Returns contract address
┃        └─> Neobot records in Ledger
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Mint Flow

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 1. moltbot factory:mint
┃    └─> Neobot skill
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 2. nxf mint --contract 0x...
┃    └─> smart-cli
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 3. Call contract.mint(to, amount)
┃    └─> On-chain transaction
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 4. Tokens minted ✅
┃    └─> Neobot records in Ledger
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Deployment Architecture

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VERCEL DEPLOYMENTS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ smart-ui → smart-ui-delta.vercel.app
┃   └─ Auto-deploy from GitHub (main)
┃   └─ Build: npm run build
┃   └─ Output: .output/ (Nuxt)
┃
┃ smart-ui-mobile → nuxt-app-vert.vercel.app
┃   └─ Auto-deploy from GitHub (main)
┃   └─ Telegram Bot integration ready
┃
┃ smart-ui-landing → landing-jet-seven.vercel.app
┃   └─ Auto-deploy from GitHub (main)
┃   └─ Static site
┃
┃ neo-api → (serverless functions)
┃   └─ Vercel Functions
┃   └─ Node.js 20 runtime
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Technology Stack

```text
▓▓▓ TECH STACK
────────────────────────────────────────

Smart Contracts:
  └─ Solidity 0.8.x
  └─ Hardhat (primary)
  └─ Foundry (advanced)
  └─ OpenZeppelin libraries

Frontend:
  └─ Nuxt 3 (Vue)
  └─ Pinia (state)
  └─ Web3Auth (wallet)
  └─ Ethers.js (blockchain)

Backend:
  └─ Node.js 20
  └─ Express.js
  └─ TypeScript

CLI:
  └─ Commander.js
  └─ Chalk (colors)
  └─ Ora (spinners)

Deployment:
  └─ Vercel (frontends)
  └─ Base (L2 chain)
  └─ Polygon (L2 chain)
  └─ QuickNode (RPC)

Testing:
  └─ Vitest (TS)
  └─ Hardhat tests
  └─ Foundry tests
```

────────────────────────────────────────

## Security

```text
▓▓▓ SECURITY MEASURES
────────────────────────────────────────
└─ OpenZeppelin contracts (audited)
└─ Reentrancy guards
└─ Access control (Ownable, AccessControl)
└─ Pausable contracts
└─ Rate limiting (API)
└─ HTTPS only (Vercel)
└─ Environment variables for keys
└─ No private keys in code
└─ Formal verification (Foundry)
```

────────────────────────────────────────

## Monitoring

```text
▓▓▓ CURRENT STATE
────────────────────────────────────────
[####] Health endpoints ............ OK
[####] Vercel deployments .......... OK
[####] GitHub auto-deploy .......... OK
[#---] APM/Tracing .............. TODO
[#---] Blockchain monitoring .... TODO
[----] Alerting ................. TODO
```

────────────────────────────────────────

## Performance

```text
▓▓▓ TARGET BENCHMARKS
────────────────────────────────────────
└─ Dashboard load: < 1s
└─ Contract deploy: < 30s (Base)
└─ Token mint: < 5s
└─ API response: < 200ms
└─ Build time: < 2min
└─ Gas optimization: < 100k gas
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"8 repos, infinite possibilities."

Architecture is destiny.
────────────────────────────────────────
