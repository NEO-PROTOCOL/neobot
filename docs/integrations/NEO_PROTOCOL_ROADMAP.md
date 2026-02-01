<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
      NEØ PROTOCOL · INTEGRATION
             ROADMAP
========================================
```

Master plan for integrating all NEØ
ecosystem projects into Neobot as
orchestrator.

────────────────────────────────────────

## 🎯 Vision

**Neobot** = Central orchestrator
**Each project** = Independent entity
**Integration** = Loose-coupled skills

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NEØ PROTOCOL ARCHITECTURE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ BACKEND (Future)
┃ └─ neo-agent-full
┃    └─ Sovereign Entity
┃       ├─ Kwil DB (Decentralized SQL)
┃       ├─ IPFS (Immutable storage)
┃       ├─ GUN DB (P2P sync)
┃       └─ Ceramic (DID identity)
┃
┃ ORCHESTRATOR (This repo)
┃ └─ Neobot
┃    └─ Fork of Moltbot (elevated)
┃       ├─ WhatsApp integration
┃       ├─ Skills for all projects
┃       ├─ ADRs + Documentation
┃       └─ Unified control layer
┃
┃ TOKENIZATION
┃ └─ neo-smart-token-factory
┃    ├─ smart-core (Contracts)
┃    ├─ smart-ui (PWA)
┃    ├─ smart-cli (nxf)
┃    └─ smart-ui-mobile (Telegram)
┃
┃ INTEGRATED PROJECTS (independent)
┃ ├─ FlowCloser (Lead qual) ✅
┃ ├─ FlowPay (PIX→Token) ⏳
┃ ├─ Evolution API ⏳
┃ ├─ CEO Escalável ⏳
┃ └─ ... (all in Notion) ⏳
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## 📊 Integration Status

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PROJECT           STATUS    PRIORITY
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowCloser        [####]    🔥 HIGH
┃ FlowPay           [----]    🔥 HIGH
┃ Smart Factory     [----]    🔥 HIGH
┃ Neo One (ASI1)    [----]    ⚡ MEDIUM
┃ NodeMello.run     [----]    💤 LOW
┃ Evolution API     [----]    ⚡ MEDIUM
┃ CEO Escalável     [----]    ⚡ MEDIUM
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## 🚀 Phase 1: FlowCloser ✅

**Status:** COMPLETE

**What was done:**
- ✅ Remote integration strategy
- ✅ 4 TypeScript skills
- ✅ 2 bash scripts
- ✅ Complete documentation (7 files)
- ✅ ADR-001 (independence rationale)
- ✅ Antigravity improvements

**Deliverables:**
- `extensions/flowcloser/`
- `skills/flowcloser/`
- `scripts/flowcloser/`
- `docs/integrations/flowcloser/`

**Tech Stack:**
- IQAI Agent (@iqai/adk)
- Express.js (Railway)
- Instagram/WhatsApp (Meta API)
- SQLite + IPFS

────────────────────────────────────────

## 🎯 Phase 2: FlowPay (Next)

**Status:** PENDING

**Objective:**
Integrate PIX→Token gateway with Neobot
orchestration.

**Planned deliverables:**
- `extensions/flowpay/integration.json`
- `skills/flowpay/` (buy, status, history)
- `scripts/flowpay/` (check-balance, etc)
- `docs/integrations/flowpay/`
- ADR-002 (payment gateway strategy)

**Tech Stack (expected):**
- PIX API
- Blockchain bridge
- $NEOFLW / USDC conversion

────────────────────────────────────────

## 🏭 Phase 3: Smart Factory

**Status:** PENDING

**Objective:**
Integrate tokenization factory with
Neobot skills.

**Planned deliverables:**
- `extensions/smart-factory/`
- `skills/smart-factory/` (mint, bridge,
  status, deploy)
- `docs/integrations/smart-factory/`
- ADR-003 (tokenization architecture)

**Repos:**
- smart-core (Contracts)
- smart-ui (PWA/Landing)
- smart-cli (nxf CLI)
- smart-ui-mobile (Telegram miniapp)

────────────────────────────────────────

## 🤖 Phase 4: Neo One (ASI1)

**Status:** PENDING

**Objective:**
Integrate ASI1 LLM agent with Neobot.

**Planned deliverables:**
- `extensions/neo-one/`
- `skills/neo-one/` (chat, analyze)
- `docs/integrations/neo-one/`
- ADR-004 (ASI1 integration strategy)

**Tech Stack (expected):**
- ASI1 API
- Agent orchestration
- Multi-model fallback

────────────────────────────────────────

## 📡 Phase 5: NodeMello.run

**Status:** PENDING

**Objective:**
Integrate node infrastructure with
Neobot monitoring.

**Planned deliverables:**
- `extensions/nodemello/`
- `skills/nodemello/` (status, deploy)
- `docs/integrations/nodemello/`
- ADR-005 (infrastructure strategy)

────────────────────────────────────────

## 🔄 Phase 6: Evolution API

**Status:** PENDING

**Objective:**
Compare with FlowCloser, integrate
or deprecate.

**Analysis needed:**
- Feature comparison
- Performance benchmark
- Use case overlap

────────────────────────────────────────

## 💼 Phase 7: CEO Escalável

**Status:** PENDING

**Objective:**
Integrate CEO automation platform.

**Analysis needed:**
- Architecture review
- Integration points
- Value proposition

────────────────────────────────────────

## 🎯 Integration Principles

**Every project MUST:**

1. **Independence**
   - Own repository
   - Own deploy pipeline
   - Own lifecycle

2. **Orchestration**
   - Neobot skills (read/write)
   - HTTP API (where applicable)
   - Filesystem access (if local)

3. **Documentation**
   - `README.md` (overview)
   - `strategy.md` (integration approach)
   - `architecture.md` (diagrams)
   - `api-reference.md` (endpoints)
   - `development.md` (how to dev)
   - `troubleshooting.md` (debug guide)
   - `CHANGELOG.md` (history)

4. **ADR**
   - Why independent?
   - Integration rationale
   - Trade-offs documented

5. **Configuration**
   - `integration.json` (metadata)
   - Endpoints map
   - Data paths
   - IDE preferences

────────────────────────────────────────

## 🏆 Success Metrics

**Integration considered complete when:**

✅ Skills working (tested)
✅ Scripts functional (if applicable)
✅ Documentation complete (7 files min)
✅ ADR written (rationale clear)
✅ Configuration exists (integration.json)
✅ Production verified (if deployed)

────────────────────────────────────────

## 🔗 References

**NEØ Ecosystem:**
- neo-agent-full (Sovereign backend)
- neo-agent-dashboard (Visualization)
- neo-smart-token-factory (Tokenization)

**External:**
- Moltbot (Fork origin)
- IQAI Agent (FlowCloser brain)
- ~Thirdweb (Evaluated~ → Removed)
  └─ Substituído por NEØ Smart Factory

────────────────────────────────────────

## 📅 Timeline

**Q1 2026:**
- ✅ FlowCloser complete
- ⏳ FlowPay integration
- ⏳ Smart Factory integration

**Q2 2026:**
- Neo One (ASI1)
- Evolution API analysis
- CEO Escalável integration

**Q3-Q4 2026:**
- NodeMello.run
- neo-agent-full migration
- Full ecosystem unification

────────────────────────────────────────

## 💰 Funding Strategy

**Current focus:**
ROI from existing projects before
advancing neo-agent-full complexity.

**Priority:**
Launch working products → Generate
revenue → Fund sovereign infrastructure.

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
