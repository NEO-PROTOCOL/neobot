```mermaid
graph TB
    subgraph NEW_PROTOCOL_MODULAR_SYSTEM["NΞØ PROTOCOL: SISTEMA MODULAR SOBERANO"]
        direction TB

        %% ORQUESTRAÇÃO CENTRAL (O Cérebro)
        subgraph ORCHESTRATION["🧠 ORQUESTRAÇÃO CENTRAL (Neobot)"]
            NEOBOT[("Neobot Core (Moltbot Fork)<br/>Local Gateway")]
            SKILLS["Skill Registry (IPFS)<br/>Habilidades Dinâmicas"]
            CLI["CLI Toolkit (nxf/neo)<br/>Comandos de Terminal"]
            NEOBOT --> SKILLS
            NEOBOT --> CLI
        end

        %% CAMADA DE VALOR (O Dinheiro)
        subgraph VALUE_LAYER["💰 CAMADA DE VALOR (Finance)"]
            FLOWPAY["FlowPay Gateway<br/>(PIX ↔ Crypto)"]
            SMART_FACTORY["Smart Factory NEØ<br/>(Token Forge)"]
            TREASURY[("Treasury DAO<br/>(Cofre Soberano)")]
        end

        %% CAMADA DE INTERAÇÃO (A Frente)
        subgraph FRONT_LAYER["📲 CAMADA DE INTERAÇÃO (Clientes/Users)"]
            FLOWOFF["FlowOFF Agency<br/>(Landing/Proposals)"]
            FLOWCLOSER["FlowCloser Agent<br/>(Lead Qualification)"]
            WOD["WOD [X] PRO<br/>(Fitness Game)"]
        end

        %% INTEGRAÇÃO INTELIGENTE (A Rede Neural)
        subgraph INTELLIGENCE["🤖 INTELIGÊNCIA DISTRIBUÍDA"]
            NEO_ONE["NΞØ:One (ASI1)<br/>Agentic Node"]
            AGENT_FULL["Agent-Full (LTM)<br/>Memória de Longo Prazo"]
        end

        %% PROTOCOLOS & CONEXÕES (As Sinapses)
        %% Comunicação Assíncrona via Protocolo
        SKILLS -.->|Protocol: neo:pay| FLOWPAY
        SKILLS -.->|Protocol: neo:mint| SMART_FACTORY
        SKILLS -.->|Protocol: neo:qualify| FLOWCLOSER

        %% Fluxo de Negócio (O Ciclo de Vida)
        FLOWCLOSER -->|Leads Qualificados| FLOWOFF
        FLOWOFF -->|Pagamento| FLOWPAY
        FLOWPAY -->|Taxas/Mint| SMART_FACTORY
        SMART_FACTORY -->|Tokens| WOD

        %% Memória e Contexto
        NEOBOT <-->|Context Sync| NEO_ONE
        NEO_ONE <-->|Knowledge Graph| AGENT_FULL

    end

    %% ESTILO DO DIAGRAMA
    classDef core fill:#222,stroke:#0f0,stroke-width:2px,color:#fff
    classDef money fill:#330,stroke:#fc0,stroke-width:2px,color:#fff
    classDef front fill:#003,stroke:#0cf,stroke-width:2px,color:#fff
    classDef ai fill:#202,stroke:#f0f,stroke-width:2px,color:#fff
    
    class NEOBOT,SKILLS,CLI core
    class FLOWPAY,SMART_FACTORY,TREASURY money
    class FLOWOFF,FLOWCLOSER,WOD front
    class NEO_ONE,AGENT_FULL ai
```

### 📜 Regras de Ouro do Sistema Modular (A Lei de Ferro)

1.  **Soberania dos Nós**: Cada caixa acima (Projeto) deve funcionar sozinha. Se o `Neobot` desligar, o `FlowPay` continua processando pagamentos e a `Agência` continua captando leads.
2.  **Protocolo > Acoplamento**: Jamais `import` código de um projeto dentro de outro. Use APIs, Webhooks ou Skills do Protocolo (`neo:skill`).
3.  **Segurança Centralizada**: Segredos ficam no **Bitwarden**. Chaves (`.env`) nunca são commitadas. O deploy é feito por pipelines autorizados.
4.  **Estado Descentralizado**: Dados críticos vivem no IPFS ou na Blockchain (Base/Polygon). Não dependemos de bancos de dados proprietários únicos.

---
**Status da Auditoria (01/Fev/2026):**
- [x] Agência FlowOFF: Mapeada
- [x] FlowPay: Mapeado
- [x] Smart Factory: Integrada
- [x] WOD [X] PRO: Documentação Encontrada
