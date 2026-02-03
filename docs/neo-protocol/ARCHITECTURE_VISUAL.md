# NΞØ PROTOCOL - Visual Architecture

Este diagrama reflete o estado atual ("Organismo Vivo") do projeto, mapeando conexões ativas, pendentes e futuras.

```mermaid
graph TB
    subgraph NEOBOT["🎯 NEOBOT (Protocol Center)"]
        CORE[Core: Gateway + Routing + Sessions]
        SKILLS[NEO Skills Registry - IPFS]
        CLI[CLI: neobot command]
        ID[mio-system Identity]
        WARRIOR[Node Warrior: Sovereign Exec]
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
    CORE --- WARRIOR
    
    SKILLS --- FC_SKILL
    SKILLS --- TG_SKILL
    SKILLS --- PAY
    SKILLS --- FACTORY
    FACTORY --- |Registry| NEO_CONTRACTS[NEO Protocol Contracts]

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
    
    class CORE,CLI,ID,WARRIOR,SKILLS,TG_SKILL,ANTHROPIC,IPFS_NODE,LIGHTHOUSE connected
    class FC_SKILL,WA_SKILL,FACTORY,PAY,NOTION_SKILL warning
    class KWIL,STORAGE future
    class FC_AGENT,FLOWPAY active_node
```

## 🗺️ Legenda de Status

| Cor | Significado | Descrição |
| :--- | :--- | :--- |
| **Verde (Connected)** | Ativo & Verificado | Código implementado, build passando e comunicação estável. |
| **Amarelo (Warning)** | Pendente / Configuração | Skill existe no repositório mas requer chaves de API ou setup final. |
| **Azul Dash (Future)** | Roadmap | Funcionalidade planejada em fase de especificação (ex: Kwil DB). |
| **Ciano (Active Node)** | Gerador de Valor | Componentes que estão rodando e gerando impacto direto no negócio. |

## 🔗 Próximas Conexões Críticas

1.  **WhatsApp Channel (WA_SKILL)**: Finalizar o login via `wacli` para automatização de disparo de boletos/PIX.
2.  **Notion Sync**: Automatizar o reporte de leads qualificados do FlowCloser diretamente para o Workspace de vendas.
3.  **Smart Factory**: Ativação dos contratos inteligentes para tokenização das entregas da agência.

---
## 🌐 Networking Map (Railway Internal)

Para otimizar a latência e aumentar a segurança, o ecossistema utiliza a rede privada do Railway:

| Serviço | Domínio Interno (.railway.internal) | Protocolo |
| :--- | :--- | :--- |
| **NEØ Dashboard** | `neo-dashboard` | HTTP (Port: 3000) |
| **NEØ Agent** | `neo-agent` | HTTP (Port: 3000) / WS |
| **Lighthouse IPFS** | `lighthouse-gateway` | HTTP |

---
*Ultima atualização: 01 Fev 2026*
