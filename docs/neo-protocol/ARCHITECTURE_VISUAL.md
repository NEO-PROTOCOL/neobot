# NΞØ PROTOCOL - Visual Architecture

Este diagrama reflete o estado atual ("Organismo Vivo") do projeto, mapeando conexões ativas, pendentes e futuras.

```mermaid
graph TB
    subgraph NEXUS["🌌 NEO NEXUS (Heart/Orchestrator)"]
        HUB[Core Hub: Event Bus]
        WEBHOOK[Webhook Dispatcher]
    end

    subgraph ARCHITECT["🎯 NEOBOT (Mind/Architect)"]
        DEV[Dev Tool: Coding Assistant]
        SKILLS[NEO Skills Registry - IPFS]
        CLI[CLI: neobot command]
        ID[mio-system Identity]
        WARRIOR[Node Warrior: Sovereign Exec]
    end

    subgraph ACTIVE_SKILLS["✅ SKILLS ATIVAS"]
        FC_SKILL[FlowCloser Integration]
        AG_SKILL[Neo-Agent-Full Integration]
        FACTORY[Smart Factory Skill]
        PAY[FlowPay Skill]
    end

    subgraph FLOWCLOSER["🔔 FLOWCLOSER (Notifier)"]
        FC_SRV[Minimalist Notifier]
        FC_WA[WhatsApp API]
    end

    subgraph NEO_AGENT_FULL["🤖 NEO-AGENT-FULL (Agent)"]
        AG_SRV[Full AI Agent]
        AG_WA[WhatsApp + Web3]
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
    HUB --- SKILLS
    HUB --- CLI
    HUB --- ID
    HUB --- WARRIOR
    
    HUB -->|Dipatch| FC_SRV
    HUB <-->|Orchestrate| AG_SRV
    
    SKILLS --- FACTORY
    FACTORY --- |Registry| NEO_CONTRACTS[NEO Protocol Contracts]

    HUB -.->|Hosted on| RAILWAY[Railway]
    SKILLS --> LIGHTHOUSE[Lighthouse Pinning]
    

    PAY -.->|Triggers| FLOWPAY
    FLOWPAY <-->|Audit & Security| FACTORY
    
    
    %% Status Visual
    classDef connected fill:#44ff44,stroke:#00aa00,stroke-width:2px,color:#000
    classDef warning fill:#ffcc00,stroke:#aa8800,stroke-width:2px,color:#000
    classDef future fill:#8888ff,stroke:#0000ff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
    classDef nexus fill:#6b46c1,stroke:#553c9a,stroke-width:3px,color:#fff
    
    class HUB,CLI,ID,WARRIOR,SKILLS,LIGHTHOUSE connected
    class FC_SRV,AG_SRV,FACTORY,PAY warning
    class KWIL,STORAGE future
    class NEXUS nexus
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
