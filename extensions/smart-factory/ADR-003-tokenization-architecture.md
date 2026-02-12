<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ADR-003 · SMART FACTORY TOKENIZATION
           8-REPO ARCHITECTURE
========================================
```

**Status:** ACCEPTED ✅  
**Date:** 2026-01-30  
**Decider:** NODE NEØ (Node Architect)  
**Priority:** 🔥 HIGH (Revenue Generator)

────────────────────────────────────────

## CONTEXT

NEO Smart Factory is a tokenization
platform consisting of 8 repositories
across the full stack:

- Contracts (Hardhat/Foundry)
- PWA Dashboard (Nuxt)
- CLI Tool (nxf)
- Telegram Miniapp
- Landing pages
- APIs

All deployed independently on Vercel.

────────────────────────────────────────

## DECISION

-*Integrate via nxf CLI bridge + HTTP APIs*

Smart Factory remains as 8 independent
repositories. Neobot orchestrates via:

1. **nxf CLI wrapper** (local commands)
2. **HTTP API calls** (dashboards)
3. **Skills** (deploy, mint, verify, status)
4. **Scripts** (check-dashboard, test-nxf)

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ SMART FACTORY (8 Repos)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 1. smart-core (Hardhat contracts)
┃    └─> Foundry tests
┃        └─> Base/Polygon deploy
┃
┃ 2. smart-ui (PWA Dashboard)
┃    └─> Vercel: smart-ui-delta.vercel.app
┃        └─> Mint/burn/transfer UI
┃
┃ 3. smart-cli (nxf tool)
┃    └─> Global CLI: nxf deploy, nxf mint
┃        └─> Wrapped by Neobot skills
┃
┃ 4. smart-ui-mobile (Telegram miniapp)
┃    └─> Vercel: nuxt-app-vert.vercel.app
┃        └─> Ready for BotFather
┃
┃ 5. smart-ui-landing
┃    └─> Vercel: landing-jet-seven.vercel.app
┃        └─> Marketing page
┃
┃ 6. neo-api (Deploy/Compile API)
┃    └─> Backend for smart-ui
┃
┃ 7. forge-core (Contract library)
┃    └─> Foundry-based core contracts
┃
┃ 8. forge-modules (Templates)
┃    └─> Pre-built contract modules
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NEOBOT (Orchestrator)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Skills (nxf wrappers)
┃ ░ Scripts (dashboard checks)
┃ ░ ADRs + Documentation
┃ ░ integration.json (8 repos map)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ORGANIZATIONAL STRATEGY

### Why 8 Repositories?

**Separation of Concerns:**

1. **smart-core**: Contract development
   - Hardhat tooling
   - Solidity codebase
   - Test suite
   - Deploy scripts

2. **forge-core + forge-modules**: Foundry
   - Alternative contract framework
   - Gas optimization
   - Advanced testing

3. **smart-ui**: User interface
   - Nuxt PWA
   - Web3 integration
   - Dashboard features

4. **smart-ui-mobile**: Mobile experience
   - Telegram miniapp
   - Mobile-first design
   - Bot integration

5. **smart-ui-landing**: Marketing
   - Landing page
   - Product info
   - Lead capture

6. **neo-api**: Backend services
   - Compilation API
   - Deploy orchestration
   - Metadata management

7. **smart-cli (nxf)**: CLI tool
   - Developer experience
   - Local deployment
   - Contract interaction

────────────────────────────────────────

## NFX CLI INTEGRATION

### Wrapper Skills

```bash
# Neobot wraps nxf commands

# Deploy contract
moltbot factory:deploy \
  --name MyToken \
  --symbol MTK \
  --supply 1000000

# Internally calls:
# nxf deploy --name MyToken --symbol MTK --supply 1000000

# Mint tokens
moltbot factory:mint \
  --contract 0x... \
  --to 0x... \
  --amount 100

# Status check
moltbot factory:status \
  --contract 0x...

# Verify on explorer
moltbot factory:verify \
  --contract 0x... \
  --network base
```

────────────────────────────────────────

## CONSEQUENCES

### Positive ✅

1. **Preserved autonomy**
   - Each repo has own lifecycle
   - Independent deployments
   - Team can work in parallel

2. **Tech stack flexibility**
   - Hardhat + Foundry coexist
   - Nuxt for UI, Astro for landing
   - Best tool for each job

3. **Vercel optimization**
   - Each app optimized separately
   - Edge functions per domain
   - Independent scaling

4. **Clear responsibilities**
   - smart-core = Contracts
   - smart-ui = Dashboard
   - nxf = CLI/Dev experience
   - Neobot = Orchestration

### Negative ⚠️

1. **Synchronization complexity**
   - 8 repos need version alignment
   - Mitigated by nxf CLI abstraction
   - integration.json maps all

2. **Documentation distributed**
   - Neobot centralizes docs
   - ADRs provide context

3. **Dependency management**
   - Contract ABI updates
   - Mitigated by automated tooling

────────────────────────────────────────

## NEOBOT INTEGRATION

### Skills Structure

```typescript
// skills/smart-factory/deploy.ts
export async function execute(ctx) {
  // Read integration config
  const config = await readIntegration('smart-factory');
  
  // Call nxf CLI
  const result = await execAsync(
    `nxf deploy --name ${ctx.args.name} --symbol ${ctx.args.symbol}`
  );
  
  // Parse output
  const contract = parseNxfOutput(result.stdout);
  
  // Record in ledger
  await ctx.ledger.record({
    action: 'deploy_contract',
    actor: 'user',
    channel: 'cli',
    details: { contract }
  });
  
  return { success: true, contract };
}
```

### integration.json

```json
{
  "name": "NEO Smart Factory",
  "version": "1.0.0",
  "type": "remote",
  "status": "high_priority",
  "organization": "neo-smart-token-factory",
  "repositories": {
    "smart-core": "https://github.com/neo-smart-token-factory/smart-core",
    "smart-ui": "https://github.com/neo-smart-token-factory/smart-ui",
    "smart-cli": "https://github.com/neo-smart-token-factory/smart-cli",
    "smart-ui-mobile": "https://github.com/neo-smart-token-factory/smart-ui-mobile",
    "smart-ui-landing": "https://github.com/neo-smart-token-factory/smart-ui-landing",
    "neo-api": "https://github.com/neo-smart-token-factory/neo-api",
    "forge-core": "https://github.com/neo-smart-token-factory/forge-core",
    "forge-modules": "https://github.com/neo-smart-token-factory/forge-modules"
  },
  "deployments": {
    "dashboard": "https://smart-ui-delta.vercel.app",
    "landing": "https://landing-jet-seven.vercel.app",
    "mobile": "https://nuxt-app-vert.vercel.app"
  },
  "cli": {
    "tool": "nxf",
    "install": "npm install -g @neo-smart-factory/cli",
    "version": "1.2.0"
  },
  "networks": {
    "base": {
      "chainId": 8453,
      "rpc": "https://mainnet.base.org"
    },
    "polygon": {
      "chainId": 137,
      "rpc": "https://polygon-rpc.com"
    }
  },
  "maintainer": "NODE NEØ",
  "last_updated": "2026-01-30"
}
```

────────────────────────────────────────

## REVENUE MODEL

**Factory-as-a-Service (FaaS):**

1. **Mint Fees**
   - Fee per token mint
   - Creator pays for deployment

2. **White-label Licensing**
   - Agencies use Factory
   - Monthly/yearly subscription

3. **Template Sales**
   - Pre-built contract modules
   - One-time purchase

4. **Consulting**
   - Custom contract development
   - Integration support

────────────────────────────────────────

## ALTERNATIVES CONSIDERED

### A) Monorepo (Turborepo/Nx)
- Pros: Single deploy, shared deps
- Cons: Complexity, Vercel limits
- ❌ NOT CHOSEN

### B) 3 Repos (Contract, UI, CLI)
- Pros: Simpler than 8
- Cons: Loss of modularity
- ❌ NOT CHOSEN

### C) 8 Independent Repos ← CHOSEN
- Pros: Max flexibility, clear ownership
- Cons: Sync complexity
- ✅ CHOSEN

────────────────────────────────────────

## SUCCESS METRICS

**Month 1:**
- nxf CLI working locally
- Skills wrapping nxf commands
- 1 test deploy on Base

**Quarter 1:**
- 10+ tokens deployed for clients
- R$5,000+ FaaS revenue
- Dashboard at 1,000+ visits/mo

**Year 1:**
- 100+ tokens deployed
- R$50,000+ FaaS revenue
- White-label licensing active

────────────────────────────────────────

## REFERENCES

- Smart Factory GitHub org
- nxf CLI documentation
- `docs/integrations/smart-factory/`

────────────────────────────────────────

## RELATED ADRS

- ADR-002 (FlowPay): Revenue integration
- ADR-001 (FlowCloser): Integration model

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"8 repos, 1 vision.
 Tokenization for all."

Code is law. Deploy with pride.
────────────────────────────────────────
