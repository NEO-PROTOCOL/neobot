<!-- markdownlint-disable MD003 MD007 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->
```
░█▀█░█▀▀░█▀█░░░█▀█░█▀▄░█▀█░▀█▀░█▀█░█▀▀░█▀█░█░░
░█░█░█▀▀░█░█░░░█▀▀░█▀▄░█░█░░█░░█░█░█░░░█░█░█░░
░▀░▀░▀▀▀░▀▀▀░░░▀░░░▀░▀░▀▀▀░░▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀

```text
========================================================================
[####] Built on Moltbot ............................................ OK
[####] Web3 · Decentralized · Self-hosted .......................... OK
[####] Modular Ecosystem (New Protocol) ............................ OK
========================================================================
```

> **[📜 LEIA O MANIFESTO MODULAR](docs/neo-protocol/MODULAR_MANIFESTO.md)**: "Um sistema modular entre projetos que se falam."

<p align="center">
  <img src="docs/assets/neobot-logo.png" alt="NEØ Protocol" width="400">
</p>

<p align="center">
  <a href="https://github.com/neomello/neobot/actions"><img src="https://img.shields.io/github/actions/workflow/status/neomello/neobot/ci.yml?branch=main&style=for-the-badge" alt="CI"></a>
  <a href="https://github.com/neomello/neobot/releases"><img src="https://img.shields.io/github/v/release/neomello/neobot?include_prereleases&style=for-the-badge" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT"></a>
  <a href="https://files.lighthouse.storage/?referBy=cf37bdc80bcf4ff2bd162671c3f6b3fa"><img src="https://img.shields.io/badge/Powered%20by-Lighthouse%20Storage-00D9FF?style=for-the-badge&logo=ipfs&logoColor=white" alt="Lighthouse Storage"></a>
</p>

```text
========================================================================
                         WHAT IS NEØ PROTOCOL?
========================================================================
```

NEØ.BOT is a decentralized AI assistant control plane that runs on
your infrastructure, with your rules, following Web3 principles.
A code managed by the NEØ protocol.

Born from Moltbot's industrial-grade foundation. Hybrid architecture:

```text
┌────────────────────────────────────────────────────────────────┐
│ ▓▓▓ STACK                                                      │
├────────────────────────────────────────────────────────────────┤
│ └─ 40% OpenClaw Core  → Gateway, channels, agent runtime       │
│ └─ 60% NEØ Layer    → IPFS, Web3 identity, self-hosted         │
└────────────────────────────────────────────────────────────────┘
```

Why it matters: traditional assistants lock you into centralized
platforms. NEØ gives you self-sovereignty, decentralization,
transparency, resilience, and privacy.

```text
========================================================================
                      RECOGNITION & FOUNDATION
========================================================================
```

We recognize Moltbot and Peter Steinberger for building the most
sophisticated AI assistant control plane. NEØ extends that foundation.

> "Moltbot gave us the engine. NEØ Protocol is breaking the speed
> limits."

```text
┌────────────────────────────────────────────────────────────────┐
│ ▓▓▓ FROM OPENCLAW/MOLTBOT                                      │
├────────────────────────────────────────────────────────────────┤
│ └─ Gateway (WebSocket), multi-channel (WhatsApp, Telegram, etc)│
│ └─ Pi agent runtime, security-first, health & Ledger           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ ▓▓▓ NEØ ADDS                                                   │
├────────────────────────────────────────────────────────────────┤
│ └─ IPFS Skills Registry, mio-system Identity                   │
│ └─ Web3 Extensions (PubSub, Nostr, signer), NEØ Dashboard      │
│ └─ Lighthouse Storage (perpetual IPFS storage)                 │
└────────────────────────────────────────────────────────────────┘
```

```text
========================================================================
                    STORAGE PARTNERSHIP
========================================================================
```

NEØ Protocol uses **Lighthouse Storage** for decentralized, perpetual
IPFS storage. Lighthouse provides censorship-resistant, permanent storage
for our Skills Registry and content.

<a href="https://files.lighthouse.storage/?referBy=cf37bdc80bcf4ff2bd162671c3f6b3fa">
  <img src="https://img.shields.io/badge/Lighthouse%20Storage-Partner-00D9FF?style=flat-square&logo=ipfs&logoColor=white" alt="Lighthouse Storage Partner">
</a>

**Partner Code:** `cf37bdc80bcf4ff2bd162671c3f6b3fa`  
**Learn more:** [Lighthouse Storage](https://files.lighthouse.storage/?referBy=cf37bdc80bcf4ff2bd162671c3f6b3fa)

```text
========================================================================
                         CORE FEATURES (RESUMO)
========================================================================
```

- IPFS Skills Registry (content-addressed, verifiable, censorship-
  resistant) — Powered by [Lighthouse Storage](https://files.lighthouse.storage/?referBy=cf37bdc80bcf4ff2bd162671c3f6b3fa)
- mio-system Identity (9 core identities, Web3 signatures)
- Gateway Extensions (IPFS PubSub, Nostr, Web3 Signer)
- Moltbot Core (stable): channels, agent runtime, security, Ledger

Setup e comandos: ver [**Guia de Início Rápido**](docs/core/QUICKSTART.md).

```text
========================================================================
                    WHAT MAKES NEØ DIFFERENT?
========================================================================
```

- Hosting: your infrastructure (no vendor lock-in)
- Skills: IPFS decentralized (vs centralized)
- Identity: Web3 signatures (vs OAuth/API keys)
- Data: you own it; censorship-resistant; multi-node; open-source

Vision: decentralized AI mesh, federated learning, blockchain
integration, NFT-based skills, DAO governance. Phase 1 in progress.

```text
========================================================================
                      ARCHITECTURE OVERVIEW
========================================================================
```

```mermaid
graph TB
    subgraph NEOBOT["🎯 NEOBOT (Protocol Center)"]
        CORE[Core: Gateway + Routing + Sessions]
        SKILLS[NEO Skills Registry - IPFS]
        CLI[CLI: neobot command]
        ID[mio-system Identity]
    end

    subgraph ACTIVE_SKILLS["✅ SKILLS ATIVAS"]
        FC_SKILL[FlowCloser Orchestrator]
        NOTION_SKILL[Notion Integration]
        WA_SKILL[WhatsApp Channel]
        TG_SKILL[Telegram Channel]
        FACTORY[Smart Factory Skill]
        PAY[FlowPay Skill]
    end

    subgraph CLOUD_INFRA["☁️ PROVEDORES & INFRA"]
        ANTHROPIC[Anthropic: Claude 3.5 Sonnet]
        IPFS_NODE[Local/Remote IPFS Node]
        LIGHTHOUSE[Lighthouse Pinning]
        RAILWAY[Railway: Agent Deployment]
    end

    subgraph FLOWCLOSER["🟢 FLOWCLOSER - Lead Qualification"]
        FC_AGENT[FlowCloser Agent]
        FC_INSTA[Instagram DM]
        FC_WA[WhatsApp API]
    end

    subgraph REVENUE_NODES["💰 REVENUE NODES"]
        FLOWPAY[FlowPay: Gateway PIX]
        FLOWOFF[FlowOFF: Agency Leads]
    end

    subgraph FUTURE["🔮 SOVEREIGN FUTURE"]
        KWIL[Kwil DB: Decentralized Memory]
        STORAGE[Storacha / Ceramic]
    end

    %% Conexões Ativas (Sólidas)
    CORE --- SKILLS
    CORE --- CLI
    CORE --- ID
    
    SKILLS --- FC_SKILL
    SKILLS --- TG_SKILL
    SKILLS --- PAY
    SKILLS --- FACTORY

    CORE --> ANTHROPIC
    SKILLS --> IPFS_NODE
    SKILLS --> LIGHTHOUSE
    
    FC_SKILL -.->|Orchestration| RAILWAY
    RAILWAY --- FC_AGENT
    FC_AGENT --- FC_INSTA
    FC_AGENT --- FC_WA

    PAY -.->|Triggers| FLOWPAY
    
    %% Fluxo de Receita (The Loop)
    FLOWOFF -->|Leads| FC_AGENT
    FC_AGENT -->|Qualified| FLOWOFF
    FLOWOFF -->|Payments| FLOWPAY
    
    %% Status Visual
    classDef connected fill:#44ff44,stroke:#00aa00,stroke-width:2px,color:#000
    classDef warning fill:#ffcc00,stroke:#aa8800,stroke-width:2px,color:#000
    classDef future fill:#8888ff,stroke:#0000ff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
    classDef active_node fill:#00ffcc,stroke:#00aba9,stroke-width:3px,color:#000
    
    class CORE,CLI,ID,SKILLS,TG_SKILL,ANTHROPIC,IPFS_NODE,LIGHTHOUSE connected
    class FC_SKILL,WA_SKILL,FACTORY,PAY,NOTION_SKILL warning
    class KWIL,STORAGE future
    class FC_AGENT,FLOWPAY active_node
```

```text
========================================================================
                          DOCUMENTATION
========================================================================
```

- **[REPOSITÓRIO DE DOCS (ÍNDICE)](docs/INDEX.md)** — Navegação centralizada
- **[SETUP.md](docs/core/SETUP.md)** — Instalação e comandos
- **[ARCHITECTURE_NEO_PROTOCOL.md](docs/core/ARCHITECTURE_NEO_PROTOCOL.md)** — Arquitetura completa
- **[NEXT_STEPS_V2.md](docs/core/NEXT_STEPS_V2.md)** — Roadmap 8 semanas
- **[ARCHITECTURE_VISUAL.md](docs/neo-protocol/ARCHITECTURE_VISUAL.md)** — Status visual das conexões

Upstream: <https://docs.molt.bot>

```text
========================================================================
                    COMMUNITY & ROADMAP (RESUMO)
========================================================================
```

- Twitter/X: @neoprotocol | Telegram: @neoprotocol
- Email: neo@neoprotocol.space | Site: neoprotocol.space (em breve)

Roadmap: Phase 1.0 IN PROGRESS (Foundation, Extensions, Docs, Release
v1.0.0). Detalhes em [NEXT_STEPS_V2.md](docs/core/NEXT_STEPS_V2.md).

```text
========================================================================
                          LICENSE & DISCLAIMER
========================================================================
```

- Moltbot Core (src/): MIT (upstream)
- NEØ Layer (neo/, skills/, dashboard/): MIT

NEØ Protocol is in active development. Phase 1.0 expected completion
Feb 2026. Some features experimental. Production use at your own risk
until v1.0.0.

```text
========================================================================
                           CALL TO ACTION
========================================================================
```

Star the repo · Read [INDEX.md](docs/INDEX.md) · Check
[ARCHITECTURE_VISUAL.md](docs/neo-protocol/ARCHITECTURE_VISUAL.md) · Join
community for updates.

```

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│       █                                                         │
│   ▄███     NΞØ MELLØ                                            │
│  █  █ █    Core Architect · NΞØ Protocol                        │
│  █ █  █    neo@neoprotocol.space                                │
│   ███▀                                                          │
│  █                                                              │
│     "Code is law. Expand until chaos becomes protocol."         │
│                                                                 │
│     Security by design. Exploits find no refuge here.           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```