# 🔐 MIO System - Registro de Identidades NEØ Protocol

**Data:** 29 Janeiro 2026  
**Sistema:** [mio-system](https://github.com/neomello/mio-system)  
**Node Arquiteto:** Mellø

---

## 📋 Identidades Registradas

### 🧠 Agentes (Inteligências)

#### 1. neo-agent-full
```bash
./scripts/register-identity.sh agent neo-agent-full "Cerebro/LangGraph ReAct"
```

**Detalhes:**
- **Tipo:** Agent (Autonomous Intelligence)
- **Função:** Raciocínio complexo, memória soberana, identidade DID
- **Stack:** LangGraph, Gemini 1.5, Claude, Kwil, Ceramic, IPFS, GUN.js
- **Camada:** 3 - Cérebro
- **Repo:** https://github.com/neomello/neo-agent-full
- **Status:** 🟢 Ativo

**Permissões:**
- Read: GitHub, Brave Search, Notion (MCP)
- Write: Twitter, Kwil DB, Ceramic Logs, IPFS
- Execute: LangGraph planning, Tool use

**DID:** (aguardando criação via Ceramic)

---

#### 2. Neobot
```bash
./scripts/register-identity.sh agent neobot "Toolkit/Operations"
```

**Detalhes:**
- **Tipo:** Agent (Operational Toolkit)
- **Função:** Skills operacionais, CLI, automações, WhatsApp nativo
- **Stack:** TypeScript, Node.js, Skills (70+), MCP Server, Baileys
- **Camada:** 2 - Toolkit
- **Repo:** https://github.com/neomello/neobot
- **Status:** 🟢 Ativo

**Permissões:**
- Read: File system, Notion (MCP), GitHub
- Write: Telegram, WhatsApp (Baileys), Ledger, Health logs
- Execute: CLI commands, Skills, Health checks

**Identidade:** Usa DID do neo-agent-full (delegated)

---

### 🎛️ Plataformas (Orchestrators)

#### 3. NodeMello (neoflowoff-nodemello.run)
```bash
./scripts/register-identity.sh platform nodemello "Orchestrator/Content State Machine"
```

**Detalhes:**
- **Tipo:** Platform (Orchestrator)
- **Função:** Content State Machine, governança editorial
- **Stack:** Node.js, State Machines, JSON Contracts
- **Camada:** 4 - Orquestração
- **Repo:** https://github.com/neomello/neoflowoff-nodemello.run
- **Status:** 🟢 Ativo

**Fluxo:**
```
DRAFT → WAITING_HUMAN → APPROVED → SCHEDULED → POSTED → ARCHIVED
```

**Permissões:**
- Read: neo-agent-full (drafts)
- Write: FlowCloser (WhatsApp), Twitter API, Instagram API
- Execute: Workflow automation, Asset management

---

#### 4. Smart Factory
```bash
./scripts/register-identity.sh platform smart-factory "Tokenization/Multi-chain"
```

**Detalhes:**
- **Tipo:** Platform (Tokenization Engine)
- **Função:** Deploy contratos, mint tokens, bridge cross-chain
- **Stack:** Solidity, Tact (TON), Hardhat, OpenZeppelin
- **Camada:** Valor & Token
- **Repos:** 
  - https://github.com/neo-smart-token-factory/smart-core
  - https://github.com/neo-smart-token-factory/docs
  - https://github.com/neo-smart-token-factory/smart-cli
- **Status:** 🟡 Pré-lançamento (v0.5.3-neural-core)

**Contratos:**
- NeoTokenV2 (ERC20Permit, gasless, bridgeable)
- NeoSmartFactory (multi-protocol)
- TON Jetton (TEP-74 compliant)
- Circuit Breaker (Guardian Role)

**Redes:** Base (L2), Polygon, TON

---

### 🔌 Conectores (Bridges)

#### 5. FlowCloser
```bash
./scripts/register-identity.sh connector flowcloser "External Services Bridge"
```

**Detalhes:**
- **Tipo:** Connector (External Services)
- **Função:** Bridge para Typebot, Chatwoot, Dify AI, OpenAI
- **Stack:** Evolution API, Baileys, Web3 (Kwil, Ceramic, The Graph)
- **Camada:** 1 - Conectividade
- **Repo:** https://github.com/neomello/FlowCloser-EVOLUTION
- **Deploy:** Railway (https://flowcloser-agent-production.up.railway.app)
- **Status:** 🟢 Ativo

**Nota:** WhatsApp migrado para Neobot (Baileys nativo). FlowCloser focado em External Services.

---

#### 6. FlowPay
```bash
./scripts/register-identity.sh connector flowpay "Payment Gateway PIX"
```

**Detalhes:**
- **Tipo:** Connector (Payment Gateway)
- **Função:** PIX → $NEOFLW/USDC (Base L2)
- **Stack:** Astro, Node.js, Smart Contracts
- **Camada:** Valor & Token
- **Repo:** https://github.com/neomello/flowpay (vazio - código local)
- **Local:** /Users/nettomello/CODIGOS/flowpay/ (208 arquivos)
- **Status:** 🟡 Em desenvolvimento

**Fluxo:**
```
PIX (BRL) → FlowPay → Smart Contract → $NEOFLW/USDC → User Wallet
```

---

### 📱 Interfaces (User-Facing)

#### 7. MiniApp Telegram
```bash
./scripts/register-identity.sh interface miniapp-telegram "Telegram Mini App"
```

**Detalhes:**
- **Tipo:** Interface (Mobile-first)
- **Função:** Compra de $NEOFLW, Wallet abstraction, SDR automation
- **Stack:** Vue.js, Telegram SDK, Vite
- **Camada:** 5 - Interface
- **Local:** /Users/nettomello/CODIGOS/GAMES/smart-ui-mobile/
- **Status:** 🟡 Estrutura básica

**Features planejadas:**
- `/buy <amount>` - Comprar tokens via PIX
- `/balance` - Ver saldo
- `/send <wallet>` - Enviar tokens
- Rewards & Loyalty distribution

---

#### 8. neo-agent-dashboard
```bash
./scripts/register-identity.sh interface neo-agent-dashboard "Agent Monitoring Dashboard"
```

**Detalhes:**
- **Tipo:** Interface (Monitoring)
- **Função:** Monitorar neo-agent-full (memória, DID, IPFS)
- **Stack:** Next.js, React, TypeScript
- **Camada:** 5 - Interface
- **Repo:** https://github.com/neomello/neo-agent-dashboard
- **Status:** 🟡 Em desenvolvimento

---

#### 9. Neobot Dashboard
```bash
./scripts/register-identity.sh interface neobot-dashboard "Operations Dashboard"
```

**Detalhes:**
- **Tipo:** Interface (Operational)
- **Função:** Dashboard operacional iOS-style para Neobot
- **Stack:** HTML, CSS, JS (Glassmorphic Bento Grid)
- **Camada:** 5 - Interface
- **Local:** neobot/ui/
- **Status:** 🟢 Ativo

---

## 🗺️ Mapa de Coordenação

```
┌─────────────────────────────────────────────┐
│ NEØ Protocol - Identity Coordination        │
├─────────────────────────────────────────────┤
│                                             │
│  🧠 AGENTS                                  │
│  ├── neo-agent-full (DID principal)        │
│  └── Neobot (delegated identity)           │
│                                             │
│  🎛️ PLATFORMS                               │
│  ├── NodeMello (content orchestration)     │
│  └── Smart Factory (tokenization)          │
│                                             │
│  🔌 CONNECTORS                              │
│  ├── FlowCloser (external services)        │
│  └── FlowPay (payment gateway)             │
│                                             │
│  📱 INTERFACES                              │
│  ├── MiniApp Telegram                       │
│  ├── neo-agent-dashboard                    │
│  └── Neobot Dashboard                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔐 Matriz de Permissões

| Identidade | Read | Write | Execute |
|------------|------|-------|---------|
| **neo-agent-full** | GitHub, Brave, Notion, Kwil DB | Twitter, Ceramic, IPFS, GUN.js | LangGraph, Tool use |
| **Neobot** | File system, Notion, GitHub | Telegram, WhatsApp, Ledger | Skills, CLI, Health |
| **NodeMello** | neo-agent-full drafts | FlowCloser, Twitter, Instagram | State Machine, Workflows |
| **Smart Factory** | smart-core contracts | Base, Polygon, TON blockchains | Deploy, Mint, Bridge |
| **FlowCloser** | Evolution API, Baileys | Typebot, Chatwoot, Dify | External Services |
| **FlowPay** | PIX API, Bank webhooks | Smart Contracts (mint) | Payment processing |
| **MiniApp Telegram** | Telegram SDK | User wallets | Token purchase |
| **neo-agent-dashboard** | neo-agent-full API | Dashboard state | Monitoring |
| **Neobot Dashboard** | Neobot health, ledger | Dashboard state | UI operations |

---

## 🚀 Próximos Passos

1. **Executar Scripts de Registro:**
   ```bash
   cd ~/mio-system
   chmod +x scripts/register-identity.sh
   
   # Registrar todas as identidades
   ./scripts/register-identity.sh agent neo-agent-full "Cerebro/LangGraph"
   ./scripts/register-identity.sh agent neobot "Toolkit/Operations"
   ./scripts/register-identity.sh platform nodemello "Orchestrator/Content"
   ./scripts/register-identity.sh platform smart-factory "Tokenization/Multi-chain"
   ./scripts/register-identity.sh connector flowcloser "External Services Bridge"
   ./scripts/register-identity.sh connector flowpay "Payment Gateway PIX"
   ./scripts/register-identity.sh interface miniapp-telegram "Telegram Mini App"
   ./scripts/register-identity.sh interface neo-agent-dashboard "Agent Monitoring"
   ./scripts/register-identity.sh interface neobot-dashboard "Operations Dashboard"
   ```

2. **Atualizar MAPA_MIO.md:**
   - Documentar visão completa do ecossistema
   - Adicionar diagrama de coordenação
   - Matriz de permissões detalhada

3. **Criar DID para neo-agent-full:**
   - Registrar via Ceramic Network
   - Documentar DID string
   - Atualizar mio-system

4. **Auditar Acessos:**
   - Validar permissões de cada identidade
   - Configurar rate limiting
   - Implementar access control

---

**Documento criado em:** 29 Janeiro 2026  
**Autor:** Mellø (NEØ Protocol - Node Arquiteto)
