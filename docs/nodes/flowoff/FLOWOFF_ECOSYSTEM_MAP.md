<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
   FLOWOFF ECOSYSTEM MAP v1.0
========================================
```

**Data:** 30 Janeiro 2026  
**Node Arquiteto:** NODE NEØ

────────────────────────────────────────

## VISÃO GERAL

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NEØ FLOWOFF ECOSYSTEM
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ ░ AGÊNCIA DE MARKETING DIGITAL
┃ ░ BLOCKCHAIN & WEB3 SOLUTIONS
┃ ░ AI-POWERED LEAD GENERATION
┃ ░ PAYMENT GATEWAY (PIX → CRYPTO)
┃
┃ Instagram: @neoflowoff.eth
┃ Site: https://www.neoflowoff.agency/
┃ Token: $NEOFLW (Base Mainnet)
```

────────────────────────────────────────

## PROJETOS PRINCIPAIS

```text
▓▓▓ 1. NEØ FLOWOFF (AGÊNCIA)
────────────────────────────────────────
└─ Site: https://www.neoflowoff.agency/
└─ Repo: github.com/NEO-PROTOCOL/
        neo-flowoff-pwa
└─ Stack: HTML/CSS/JS, PWA, Web3Auth
└─ Deploy: Vercel
└─ Status: 🟢 Produção

└─ Serviços:
   └─ Sites & WebApps
   └─ SAAS / BAAS
   └─ Tokenização de Ativos
   └─ Agentes IA & Chatbots
   └─ Marketing Digital
   └─ Blockchain Solutions

▓▓▓ 2. FLOWCLOSER AGENT (LEADS)
────────────────────────────────────────
└─ URL: flowcloser-agent-production
       .up.railway.app
└─ Repo: /CODIGOS/bots_ia/
        flowcloser_adk-ts/
└─ Stack: TS, Express, GPT-4o, Gemini,
         SQLite, Meta API
└─ Web3: Smart Factory NEØ (own arch)
└─ Deploy: Railway
└─ Status: ✅ 100% OPERACIONAL

└─ Função:
   └─ Instagram DM automation
   └─ Lead qualification AI
   └─ Conversions API (Meta Pixel)
   └─ Ghostwriter (content gen)
   └─ WhatsApp integration prep

└─ Railway IDs:
   └─ Project: 95ed3bcd-2e20-4477
                -b50c-43cd9ec04c41
   └─ Service: 78c16321-326e-4f02
                -a808-65da3344a989
   └─ Env: 6f1a6dd0-9760-4ad8
           -9cb3-f690d2575408

▓▓▓ 3. FLOWPAY (PAYMENT GATEWAY)
────────────────────────────────────────
└─ URL: https://flowpaypix.netlify.app/
└─ Repo: github.com/NEO-PROTOCOL/flowpay
└─ Local: /CODIGOS/flowpay/
└─ Stack: Astro, Web3Auth, Woovi/
         OpenPix, QuickNode
└─ Deploy: Netlify
└─ Status: 🟡 90% Completo

└─ Função:
   └─ PIX → $NEOFLW (Base)
   └─ PIX → USDC (Base)
   └─ BRL to Crypto conversion
   └─ Wallet Abstraction

└─ Versão: v2.2.0
```

────────────────────────────────────────

## ARQUITETURA DO ECOSSISTEMA

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FLOW DIAGRAM
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃  ┌──────────────────┐
┃  │ FLOWOFF.XYZ      │
┃  │ (Landing)        │
┃  └────────┬─────────┘
┃           │
┃           ├─> Serviços Oferecidos
┃           │
┃  ┌────────▼─────────┐
┃  │ FLOWCLOSER AGENT │
┃  │ (Qualifica Leads)│
┃  └────────┬─────────┘
┃           │
┃           ├─> Lead Qualificado
┃           │
┃  ┌────────▼─────────┐
┃  │ MELLØ (Humano)   │
┃  │ Fecha Venda      │
┃  └────────┬─────────┘
┃           │
┃           ├─> Cliente Confirma
┃           │
┃  ┌────────▼─────────┐
┃  │ FLOWPAY          │
┃  │ Processa PIX     │
┃  └────────┬─────────┘
┃           │
┃           └─> Entrega $NEOFLW ou USDC
```

────────────────────────────────────────

## STACK TECNOLÓGICA

```text
▓▓▓ CAMADA FRONTEND
────────────────────────────────────────
└─ FlowOFF.xyz: HTML/CSS/JS (PWA)
└─ FlowPay: Astro (SSR)
└─ MiniApps: React/Vue (Telegram)

▓▓▓ CAMADA BACKEND
────────────────────────────────────────
└─ FlowCloser: TypeScript + Express
└─ FlowPay: Netlify Functions
└─ Neobot: TypeScript (CLI + Gateway)

▓▓▓ CAMADA AI/LLM
────────────────────────────────────────
└─ GPT-4o (primary)
└─ Gemini 2.5 Flash (fallback)
└─ IQAI API (discontinued JAN 2026)
   └─ FlowCloser assume strategic role
└─ ASI1 API (planned)

▓▓▓ CAMADA WEB3
────────────────────────────────────────
└─ Smart Factory NEØ (own architecture)
└─ Web3Auth (social login)
└─ QuickNode (RPC provider)
└─ Base Mainnet ($NEOFLW token)
└─ Note: Thirdweb removido (FEV 2026)

▓▓▓ CAMADA DATABASE
────────────────────────────────────────
└─ SQLite (FlowCloser local)
└─ Supabase (planned)
└─ Kwil DB (decentralized, planned)

▓▓▓ CAMADA MESSAGING
────────────────────────────────────────
└─ Instagram DM (Meta API)
└─ WhatsApp (Baileys via Neobot)
└─ Telegram (MiniApp planned)

▓▓▓ CAMADA PAYMENT
────────────────────────────────────────
└─ PIX: Woovi/OpenPix API
└─ Crypto: Smart Factory NEØ
└─ Token: $NEOFLW (Base)
```

────────────────────────────────────────

## REPOSITORIES

```text
▓▓▓ GITHUB REPOS
────────────────────────────────────────
└─ neo-flowoff-pwa
   └─ github.com/NEO-PROTOCOL/
      neo-flowoff-pwa
   └─ Site principal da agência
   └─ 🟢 Produção (Vercel)

└─ flowpay
   └─ github.com/NEO-PROTOCOL/flowpay
   └─ Gateway de pagamentos
   └─ 🟡 90% Completo (Netlify)

└─ flowpaycash
   └─ github.com/NEO-PROTOCOL/flowpaycash
   └─ Versão anterior do FlowPay
   └─ 🟡 Backup/Archive

└─ neo-one
   └─ github.com/NEO-PROTOCOL/neo-one
   └─ Agente ASI1 autônomo (MCP v1.1)
   └─ 🟡 Em desenvolvimento

└─ neo-agent-full
   └─ github.com/NEO-PROTOCOL/neo-agent-full
   └─ LangChain + LangGraph Agent
   └─ 🟡 Em desenvolvimento

▓▓▓ LOCAL ONLY
────────────────────────────────────────
└─ flowcloser_adk-ts
   └─ /CODIGOS/bots_ia/flowcloser_adk-ts
   └─ ✅ NO RAILWAY (production)
   └─ Lead agent Instagram/WhatsApp
```

────────────────────────────────────────

## INTEGRAÇÕES EXTERNAS

```text
▓▓▓ META PLATFORMS
────────────────────────────────────────
└─ Instagram Business API
   └─ App ID: 2706639773011042
   └─ OAuth + Webhooks configured
   └─ Lead DM automation

└─ WhatsApp Business API
   └─ Via Baileys (Neobot native)
   └─ QR Code auth
   └─ +5562983231110 (NODE NEØ)

▓▓▓ AI/LLM PROVIDERS
────────────────────────────────────────
└─ OpenAI
   └─ Org: org-icjyrmJtDNf7AD6YdWTAh9Nu
   └─ Project: proj_MTlevvRFUIE...
   └─ Model: gpt-4o

└─ Google AI
   └─ Model: gemini-2.5-flash
   └─ Fallback option

└─ IQAI (discontinued JAN 2026)
   └─ FlowCloser now uses GPT-4o/Gemini
   └─ Assumes strategic AI role
└─ ASI1 (planned integration)

▓▓▓ WEB3 SERVICES
────────────────────────────────────────
└─ Smart Factory NEØ (8 repos)
   └─ Tokenization FaaS
   └─ Deploy/Mint/Bridge
   └─ Base + Polygon support
   
└─ Thirdweb (REMOVIDO FEV 2026)
   └─ Substituído por arquitetura própria

└─ QuickNode
   └─ RPC endpoints
   └─ Base + Polygon

└─ $NEOFLW Token
   └─ Contract: 0x59aa4eae743d60...
   └─ Network: Base Mainnet
   └─ Use: Ecosystem currency

▓▓▓ PAYMENT PROVIDERS
────────────────────────────────────────
└─ Woovi/OpenPix
   └─ PIX integration
   └─ BRL to Crypto conversion

▓▓▓ DEPLOYMENT PLATFORMS
────────────────────────────────────────
└─ Railway
   └─ FlowCloser Agent (production)
   └─ Project: 95ed3bcd-2e20...
   └─ Status: ✅ 100% operational

└─ Vercel
   └─ FlowOFF.xyz (production)

└─ Netlify
   └─ FlowPay (production)
```

────────────────────────────────────────

## WORKFLOW OPERACIONAL

```text
▓▓▓ AQUISIÇÃO DE CLIENTES
────────────────────────────────────────
└─ 1. Lead encontra @neoflowoff.eth
      (Instagram) ou neoflowoff.agency
└─ 2. Envia DM ou preenche formulário
└─ 3. FlowCloser Agent responde (AI)
└─ 4. Qualifica lead automaticamente
└─ 5. Lead qualificado → NODE NEØ (humano)
└─ 6. NODE NEØ fecha venda
└─ 7. Cliente paga via FlowPay (PIX)
└─ 8. Recebe $NEOFLW ou USDC
└─ 9. Projeto iniciado

▓▓▓ ENTREGA DE SERVIÇOS
────────────────────────────────────────
└─ WebApps → Neobot tools + custom dev
└─ Tokenização → NEØ Smart Factory
└─ IA Agents → FlowCloser customizado
└─ Marketing → Estratégia + execução
```

────────────────────────────────────────

## PRÓXIMOS PASSOS (ROADMAP)

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FASE 1: CONSOLIDAÇÃO (AGORA)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ [####] FlowCloser operacional .... OK
┃ [#---] FlowPay finalizar ........ 90%
┃ [----] WhatsApp integration ..... PLAN
┃ [----] Telegram MiniApp ......... PLAN

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FASE 2: EXPANSÃO (30 DIAS)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ [----] ASI1 LLM integration ..... PLAN
┃ [----] Notion automation ........ PLAN
┃ [----] Auto-reporting ........... PLAN
┃ [----] Dashboard analytics ...... PLAN

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FASE 3: ESCALA (60 DIAS)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ [----] Multi-agent system ....... PLAN
┃ [----] Revenue automation ....... PLAN
┃ [----] Client onboarding ........ PLAN
┃ [----] Token economy ($NEOFLW) .. PLAN
```

────────────────────────────────────────

## LINKS IMPORTANTES

```text
▓▓▓ PRODUCTION URLs
────────────────────────────────────────
└─ FlowOFF Site:
   https://www.neoflowoff.agency/

└─ FlowCloser Agent:
   https://flowcloser-agent-production
   .up.railway.app/

└─ FlowPay Gateway:
   https://flowpaypix.netlify.app/

└─ Instagram:
   https://www.instagram.com/
   neoflowoff.eth/

▓▓▓ GITHUB
────────────────────────────────────────
└─ neo-flowoff-pwa:
   github.com/NEO-PROTOCOL/neo-flowoff-pwa

└─ flowpay:
   github.com/NEO-PROTOCOL/flowpay

└─ neo-one:
   github.com/NEO-PROTOCOL/neo-one

▓▓▓ RAILWAY
────────────────────────────────────────
└─ Dashboard:
   railway.com/project/
   95ed3bcd-2e20-4477-b50c-43cd9ec04c41

└─ Service Logs:
   railway logs --tail

▓▓▓ TOKEN
────────────────────────────────────────
└─ $NEOFLW Contract:
   0x59aa4eae743d608fbdd4205eba59b38d
   ca755dd2

└─ BaseScan:
   basescan.org/token/
   0x59aa4eae743d608fbdd4205eba59b38d
   ca755dd2
```

────────────────────────────────────────

## DECISÕES ESTRATÉGICAS

```text
▓▓▓ SEPARAÇÃO DE RESPONSABILIDADES
────────────────────────────────────────
└─ FlowOFF.xyz
   └─ Landing page
   └─ Branding
   └─ Portfolio showcase

└─ FlowCloser Agent
   └─ Lead qualification ONLY
   └─ Instagram/WhatsApp automation
   └─ AI conversation

└─ FlowPay
   └─ Payment processing ONLY
   └─ PIX to Crypto conversion
   └─ No business logic

└─ Neobot
   └─ WhatsApp native (NODE NEØ personal)
   └─ CLI toolkit
   └─ Gateway orchestration

▓▓▓ TECH DECISIONS
────────────────────────────────────────
└─ Baileys (WhatsApp)
   └─ Free, open-source
   └─ Native to Neobot
   └─ No Meta Business dependency

└─ Railway (FlowCloser)
   └─ 24/7 uptime required
   └─ Auto-restart + monitoring
   └─ External services only

└─ ASI1 over LangChain
   └─ Better Portuguese support
   └─ Lower latency
   └─ Cost-effective

└─ Base over Polygon
   └─ Lower gas fees
   └─ Faster transactions
   └─ Better UX for users
```

────────────────────────────────────────

## NOTION INTEGRATION MAP

```text
▓▓▓ PROJETOS NO NOTION
────────────────────────────────────────
└─ FlowOFF Agency
   └─ Status: 🟢 Ativo
   └─ Camada: Produto (UC2)
   └─ Fase: 0.1 (Consolidação)
   └─ GitHub: neo-flowoff-pwa

└─ FlowCloser Agent
   └─ Status: 🟢 Produção
   └─ Camada: Interação (UC3)
   └─ Fase: 0.1 (Consolidação)
   └─ Local: bots_ia/flowcloser_adk-ts
   └─ Railway: ✅ DEPLOYED

└─ FlowPay Gateway
   └─ Status: 🟡 90% Completo
   └─ Camada: Valor & Token
   └─ Fase: 0.1 (Consolidação)
   └─ GitHub: neomello/flowpay

└─ NEØ:One Agent
   └─ Status: 🟡 Desenvolvimento
   └─ Camada: IA (UC2)
   └─ Fase: 0.2 (Expansão)
   └─ GitHub: neomello/neo-one
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Build the system.
 Let the system bring customers.
 Scale with code, not time."

FlowOFF: Where AI meets Revenue.
────────────────────────────────────────
