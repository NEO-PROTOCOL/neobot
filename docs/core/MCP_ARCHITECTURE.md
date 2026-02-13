# NΞØ MCP v1.1 — ARQUITETURA SISTÊMICA

> Documento fundacional do Model Context Protocol do NEØ Protocol.
> Escrito originalmente em `neo_one` (pré-OpenClaw), consolidado aqui como visão canônica.

---

## Diagrama Terminal — Sistema Completo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           NΞØ MCP v1.1 // NODE NΞØ                          │
│                     MODEL CONTEXT PROTOCOL — SYSTEM MAP                      │
└──────────────────────────────────────────────────────────────────────────────┘

                              HUMAN INPUT
           ┌────────────────────────────────────────────────┐
           │ texto • voz • ação UI • bot command • eventos  │
           └───────────────────────────┬────────────────────┘
                                       │
                                       ▼
                     ┌────────────────────────────────────────┐
                     │             AGENT LAYER                │
                     │  NΞØ:DigitalFather  (estratégia)       │
                     │  NΞØ:One            (transformações)   │
                     │  LLM Parser         (semantic→struct)  │
                     └──────────────────┬────────────────────┘
                                       │
                                       ▼
                     ┌────────────────────────────────────────┐
                     │             INTENT LAYER               │
                     │  { intent, entity, params, ctx, meta } │
                     │  ctx: source • session • priority      │
                     └──────────────────┬────────────────────┘
                                       │
                                       ▼
     ┌────────────────────────────────────────────────────────────────┐
     │                AUTH & POLICY LAYER (NΞØ SecureOps)            │
     │  • Signature verification (EIP-712)                            │
     │  • Role/Permission check                                       │
     │  • Rate limit / anti-abuse                                     │
     │  • Wallet abstraction (thirdweb Embedded)                      │
     │  • Gas Sponsorship / Paymaster                                 │
     └──────────────────┬─────────────────────────────────────────────┘
                        │
                        ▼
           ┌───────────────────────────────────────────────┐
           │                 SCHEMA LAYER                  │
           │  Validate JSON Schema • Typing • Formatting   │
           └──────────────────┬────────────────────────────┘
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                             MCP ROUTER (CORE)                               │
│          Orquestra para o domínio correto com fallback inteligente          │
├─────────────────────┬──────────────────┬──────────────────┬─────────────────┤
│  BLOCKCHAIN ROUTER  │  PAYMENT ROUTER  │   AGENT ROUTER   │ STORAGE ROUTER  │
│  thirdweb / alchemy │  FlowPay / PIX   │  DigitalFather / │  IPFS / DB      │
│                     │  Crypto          │  NEØ:One / ASI1  │                 │
└──────────┬──────────┴────────┬─────────┴────────┬─────────┴─────────────────┘
           │                   │                   │
           ▼                   ▼                   ▼
  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
  │ BLOCKCHAIN EXEC │ │  PAYMENT EXEC   │ │   AGENT EXEC    │
  │  deploy • mint  │ │  checkout • pay │ │  compute • plan │
  │  tx_write/read  │ │  convert • PIX  │ │  transform      │
  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
           │                   │                   │
           └───────────────────┴───────────────────┘
                                       │
                                       ▼
               ┌───────────────────────────────────────────────┐
               │             FALLBACK / ERROR SYSTEM           │
               │  • Retry Queue                                │
               │  • Alternative Routes                         │
               │  • Dead-letter storage                        │
               │  • Structured error logs                      │
               └────────────────────┬──────────────────────────┘
                                    │
                                    ▼
         ┌──────────────────────────────────────────────────────┐
         │                     STATE LAYER                      │
         │  Database  → estado vivo, versões                    │
         │  IPFS      → imutável, provas, metadata              │
         │  Log Engine→ intent history, traces                  │
         └────────────────────┬─────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────────────────┐
         │                   RESPONSE LAYER                     │
         │  { success, result, tx, cost, next, timestamp }      │
         │  Formato padronizado para agentes e UIs              │
         └────────────────────┬─────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────────────────┐
         │                  INTERFACE LAYER                     │
         │  Apps • PWAs • Bots • Dashboards • APIs              │
         │  Telegram • Web • Mini-apps • Wallet                 │
         └────────────────────┬─────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  NΞØ CONNECTED SYSTEMS (ECOSSISTEMA)                   │
│  FlowCloser • FlowPay • neo-agent-full • neo-smart-factory             │
│  neoflow-content-machine • neo-dashboard • neo-nexus                   │
│  Tokens • NFTs • XP Systems • Eventos • Automações                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Agentes e Seus Papéis

### NΞØ:DigitalFather — Estratégia e Decisão
- Análise estratégica de leads
- Decisões de alto nível e planejamento
- Orquestração de outros agentes
- Quando usar: qualificação complexa, análise de mercado, decisões multi-etapa

### NΞØ:One — Transformação e Refinamento
- **API:** `https://api.asi1.ai/v1/chat/completions`
- **Modelo padrão:** `asi1-mini`
- Transformação semântica de dados
- Geração de propostas e conteúdo
- Quando usar: geração de conteúdo, refinamento, chat, structured output

### Sandbox — Parsing e Validação
- Parsing de intents a partir de linguagem natural
- Validação semântica e normalização de inputs
- Sem dependência de API externa (local)

---

## Fluxo Multi-Agente

### Qualificação de Lead
```
HUMAN INPUT → Sandbox (parse) → DigitalFather (estratégia) → NΞØ:One (refina) → RESPONSE
```

### Geração de Proposta
```
HUMAN INPUT → Sandbox (valida) → DigitalFather (plano) → NΞØ:One (gera) → IPFS (salva) → RESPONSE
```

---

## Context Layer

```json
{
  "source": "telegram | web | api | bot | cli",
  "session": "session_id",
  "priority": "high | medium | low",
  "user_id": "user_identifier",
  "domain": "flowcloser | flowpay | neo-agent-full | dashboard",
  "metadata": {}
}
```

---

## Princípios Arquiteturais

1. **Auth & Policy é obrigatória** — toda intenção passa pela camada de segurança antes de executar
2. **Wallet Abstraction** — qualquer usuário pode operar sem fricção (login social, gasless, embedded wallet)
3. **Fallback Engine** — nenhuma falha deve travar o sistema; retry, rotas alternativas, dead-letter
4. **Response padronizado** — todo executor retorna `{ success, result, tx, cost, next, timestamp }`
5. **Contexto preservado** — agentes operam com memória de sessão, origem e prioridade

---

## Referência

- `intents.json` canônico: `docs/core/MCP_INTENTS_SPEC.json`
- Implementação ASI1: `skills/llm/asi1/chat.ts`
- Python uAgent companion: `src/neo/asi1_client.py`
- Origem: `archive/CODIGOS/neo_systems/neo_one` (pré-OpenClaw, 2024)
