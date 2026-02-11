<!-- markdownlint-disable MD003 MD007 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```
================================================================
                      NEO PROTOCOL ROADMAP
================================================================
[####] Foundation Architecture ........................... OK
[#---] Implementation Phase .............................. PREP
================================================================
```

**Versao:** 2.1.0
**Data:** 05 Fevereiro 2026
**Arquiteto:** NODE NEØ
**Timeline:** 7 semanas (release 27 Marco 2026)

```
================================================================
                        VISAO GERAL
================================================================
```

O NEO Protocol Stack e uma camada descentralizada e autonoma
construida sobre o Moltbot Core, seguindo principios Web3.

**Estrategia Hibrida:**

- 40% Moltbot Core (upstream sync) → Estabilidade
- 60% NEO Layer (independente) → Autonomia

**Status Atual:**

- Fase 0.1: COMPLETA (18 skills, 9 identities, WhatsApp+TG)
- Fase 1.0: COMPLETA (Foundation: IPFS, CLI, Keys, Identity Map)
- Fase 2.0: EM PROGRESSO (Sovereignty & Orchestration: Nexus, FlowCloser)
- Fase 3.0: PREVISTA (Dashboard & Global Deploy)

```
--------------------------------------------------------------
COMPONENTES NEO LAYER
--------------------------------------------------------------

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SKILLS REGISTRY (IPFS)                               │
├──────────────────────────────────────────────────────────┤
│ └─ Content-addressed storage                             │
│ └─ Cryptographic signatures                              │
│ └─ Pinning redundante (3+ nodes)                         │
│ └─ Substitui: ClawdHub                                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ MIO-SYSTEM IDENTITY                                  │
├──────────────────────────────────────────────────────────┤
│ └─ 9 identidades Web3 (mio-core, mio-gateway, etc)       │
│ └─ Ethereum-style signatures                             │
│ └─ Permissoes granulares                                 │
│ └─ Self-sovereign keys                                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ GATEWAY EXTENSIONS                                   │
├──────────────────────────────────────────────────────────┤
│ └─ IPFS PubSub Channel                                   │
│ └─ Web3 Signature Layer                                  │
│ └─ Nostr Relay (opcional)                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ NEO DOCS                                             │
├──────────────────────────────────────────────────────────┤
│ └─ Self-hosted (IPFS + DNS)                              │
│ └─ Versionado por CID                                    │
│ └─ Substitui: docs.molt.bot                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ DASHBOARD NEO                                        │
├──────────────────────────────────────────────────────────┤
│ └─ iOS-style UI (ja implementado)                        │
│ └─ Skills Registry UI                                    │
│ └─ Identity Manager                                      │
│ └─ IPFS Node Status                                      │
└──────────────────────────────────────────────────────────┘
```

```
================================================================
                    PROXIMOS PASSOS IMEDIATOS
================================================================
```

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ CURTO PRAZO (05 - 12 FEV) │
└──────────────────────────────────────────────────────────┘

---

1. Screenshots do Dashboard NEO

---

[ ] Preparar dashboard para captura
└─ cd dashboard && node server.js
└─ Verificar todas as rotas funcionando

[ ] Capturar telas essenciais
└─ Home screen (overview)
└─ Chat interface (conversacao ativa)
└─ Skills management (registry view)
└─ Health monitoring (status nodes)
└─ Identity manager (mio-system)
└─ Settings panel

[ ] Processar imagens
└─ Formato: PNG, 1920x1080
└─ Otimizar: TinyPNG ou similar
└─ Salvar em: docs/assets/screenshots/

[ ] Adicionar ao README.md
└─ Secao "Gallery" ou "Dashboard Preview"
└─ Usar HTML <img> para controle de tamanho

---

2. Demo Video (2-3 min)

---

[ ] Roteiro do video
└─ Intro (10s): "NEO Protocol - Decentralized AI"
└─ Onboarding (30s): pnpm install + setup
└─ CLI Demo (40s): Executar skill via terminal
└─ Dashboard Tour (50s): UI overview
└─ NEO Layer Teaser (30s): IPFS + mio-identity
└─ Call to Action (10s): Link repo + Discord

[ ] Gravacao
└─ Tool: OBS Studio ou QuickTime
└─ Resolucao: 1920x1080, 60fps
└─ Audio: Microfone limpo (sem ruido)
└─ Cursor highlight: Ativar para clareza

[ ] Edicao
└─ Tool: DaVinci Resolve (free) ou iMovie
└─ Adicionar legendas (Ingles + Portugues)
└─ Transicoes suaves
└─ Background music (opcional, sem copyright)

[ ] Upload & Distribuicao
└─ YouTube: NEO Protocol Channel
└─ Thumbnail: Custom design
└─ Descricao: Links + timestamps
└─ Adicionar ao README.md (secao "Demo")

---

3. Logo Oficial NEO BOT

---

[ ] Design do logo
└─ Conceito: Geometria, descentralizacao, Web3
└─ Paleta: Azul neon (#00D9FF) + Roxo (#9D4EDD)
└─ Tipografia: Futurista, bold
└─ Icone: Hexagono ou network mesh

[ ] Formatos
└─ SVG (escalavel)
└─ PNG: 512x512, 1024x1024, 2048x2048
└─ Favicon: 32x32, 64x64
└─ Open Graph: 1200x630

[ ] Variacoes
└─ Logo completo (icon + text)
└─ Logo icon (apenas simbolo)
└─ Dark mode version
└─ Light mode version
└─ Monocromatico

[ ] Integrar
└─ Salvar em: docs/assets/
└─ Atualizar README.md (substituir neobot-logo.png)
└─ Criar presskit.md com guidelines de uso

---

4. Setup Twitter + Telegram

---

[ ] Twitter/X (@neoprotocol)
└─ Criar conta
└─ Bio: "Decentralized AI Assistant Control Plane.
Built on Moltbot. Breaking boundaries.
#Web3 #Decentralization #AI"
└─ Link: github.com/neomello/neobot
└─ Header image: NEO Protocol banner
└─ Avatar: Logo NEO

[ ] Telegram
└─ Canal oficial: @neoprotocol_official
└─ Grupo comunidade: @neoprotocol_community
└─ Bot oficial: @neoprotocol_bot
└─ Pinned message: Link repo + roadmap

[ ] Primeiro post (ambas plataformas)
└─ Anuncio: "Introducing NEO Protocol"
└─ Video teaser (30s cut do demo)
└─ Link: README.md
└─ Hashtags: #Web3 #Decentralization #AI #IPFS

[ ] Conteudo programado
└─ Semana 1: Behind the scenes (desenvolvimento)
└─ Semana 2: Technical deep-dives (IPFS, mio-system)
└─ Semana 3: Build-up para anuncio publico

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ MEDIO PRAZO (MARCO 2026) │
└──────────────────────────────────────────────────────────┘

---

5. Website: neoprotocol.space

---

[ ] Setup infraestrutura
└─ Domain: neoprotocol.space
└─ DNS: Cloudflare ou similar
└─ Hosting: IPFS + DNSLink (descentralizado)
└─ Fallback: Vercel/Netlify (redundancia)

[ ] Stack tecnico
└─ Framework: Astro ou Next.js
└─ Styling: TailwindCSS
└─ Animacoes: Framer Motion
└─ Deploy: IPFS + CI/CD

[ ] Paginas essenciais
└─ Home: Hero + value props + CTA
└─ Features: Tabela comparativa vs tradicional
└─ Architecture: Hybrid stack diagram
└─ Roadmap: Timeline visual
└─ Docs: Link para docs IPFS
└─ Community: Discord + Telegram links

[ ] Otimizacao
└─ SEO: Meta tags, Open Graph
└─ Performance: Lighthouse 90+
└─ Responsivo: Mobile-first
└─ Acessibilidade: WCAG AA

---

6. Primeira Skill no IPFS (Proof of Concept)

---

[ ] Escolher skill
└─ Candidata: "neo-ipfs-status" (simples, didatico)
└─ Funcionalidade: Checar status do node IPFS local
└─ Metadata: skill.json completo

[ ] Implementar skill
└─ Criar: skills/neo-ipfs-status/
└─ skill.json: name, version, author, signature
└─ skill.sh: Script bash com kubo RPC
└─ README.md: Documentacao completa

[ ] Publicar no IPFS
└─ pnpm neobot neo:skill:publish ./skills/neo-ipfs-status/
└─ Retornar CID: QmXxx...
└─ Pin em 3+ nodes (redundancia)
└─ Testar retrieval: ipfs cat <CID>

[ ] Testar instalacao
└─ pnpm neobot neo:skill:install ipfs-status@1.0.0
└─ Verificar: ~/.neobot/skills/neo-ipfs-status/
└─ Executar: pnpm neobot neo-ipfs-status
└─ Output esperado: Status do node IPFS

[ ] Documentar processo
└─ Criar: docs/guides/publish-skill-ipfs.md
└─ Screencasts: Cada etapa do processo
└─ Troubleshooting: Common issues

---

7. Anuncio Publico

---

[ ] Preparar conteudo
└─ Post principal: "Introducing NEO Protocol"
└─ Thread tecnico (Twitter): Architecture breakdown
└─ Blog post: Medium ou Dev.to
└─ Press kit: Logo + screenshots + video

[ ] Timing estrategico
└─ Dia da semana: Terca ou Quarta (melhor reach)
└─ Horario: 10h-12h GMT (audiencia global)
└─ Evitar: Fim de semana, feriados

[ ] Plataformas
└─ Twitter: Post + thread
└─ Telegram: Canal + grupos relevantes
└─ Reddit: r/selfhosted, r/Web3, r/opensource
└─ Hacker News: Show HN post
└─ Product Hunt: Launch (opcional)

[ ] Follow-up
└─ Responder comentarios (24-48h criticos)
└─ Coletar feedback
└─ Publicar quick fixes se necessario
└─ Weekly update posts (progresso)

================================================================
FASE 1: FOUNDATION (2 SEMANAS)
================================================================

---

## 1.1 Estrutura NEO Directory

**Objetivo:** Criar arquitetura base do protocolo NEO

**Status:** [####] COMPLETO

**Arquivos criados:**

- neo/README.md
- neo/registry/index.ts
- neo/identity/mio-system.ts
- neo/identity/registry.ts
- neo/sdk/index.ts
- neo/cli/info.ts

---

## 1.2 NEO Skills Registry (IPFS)

**Objetivo:** Implementar registry descentralizado

**Status:** [####] COMPLETO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IMPLEMENTACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Criar neo/registry/ipfs-client.ts │
│ └─ [ ] Implementar NeoSkillsRegistry.publish() │
│ └─ [ ] Implementar NeoSkillsRegistry.install() │
│ └─ [ ] Implementar NeoSkillsRegistry.search() │
│ └─ [ ] Implementar NeoSkillsRegistry.verify() │
│ └─ [ ] Criar skill manifest schema (TypeBox) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ MIGRACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [####] Migrar skill: neo-ipfs-status │
│ └─ [####] Migrar skill: flowcloser │
│ └─ [####] Migrar skill: flowpay │
│ └─ [####] Migrar skill: smart-factory │
│ └─ [ ] Migrar skill: asi1-llm │
│ └─ [ ] Migrar skill: telegram │
│ └─ [ ] Migrar 13 skills restantes │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ INFRA │
├──────────────────────────────────────────────────────────┤
│ └─ [####] Setup IPFS node local (ipfs daemon) │
│ └─ [#---] Setup Infura IPFS (backup) │
│ └─ [####] Setup Pinata IPFS (backup) │
│ └─ [####] Criar index.json no IPFS │
│ └─ [####] Pin index em 3+ nodes │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Primeira skill publicada no IPFS

**Estimativa:** 5-7 dias

**Prioridade:** CRITICA

---

## 1.3 mio-system Identity

**Objetivo:** Ativar sistema de identidade Web3

**Status:** [####] COMPLETO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IMPLEMENTACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [####] Implementar MioIdentityManager com ethers.js │
│ └─ [####] Implementar createIdentity() │
│ └─ [####] Implementar verifyIdentity() │
│ └─ [####] Implementar signMessage() │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ KEYS GENERATION │
├──────────────────────────────────────────────────────────┤
│ └─ [####] Criar scripts/generate-mio-keys.ts │
│ └─ [####] Gerar 9 private keys (ethers.Wallet) │
│ └─ [####] Setup .env.neo (NUNCA COMMITAR) │
│ └─ [####] Adicionar .env.neo ao .gitignore │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IDENTITIES ACTIVATION │
├──────────────────────────────────────────────────────────┤
│ └─ [####] Ativar: mio-core │
│ └─ [####] Ativar: mio-gateway │
│ └─ [####] Ativar: mio-skills │
│ └─ [####] Ativar: mio-factory │
│ └─ [####] Ativar: mio-flowpay │
│ └─ [####] Ativar: mio-asi1 │
│ └─ [####] Ativar: mio-telegram │
│ └─ [####] Ativar: mio-whatsapp │
│ └─ [####] Ativar: mio-ipfs │
└──────────────────────────────────────────────────────────┘

**Deliverable:** mio-gateway identity ativa

**Estimativa:** 4-5 dias

**Prioridade:** CRITICA

---

## 1.4 NEO CLI Commands

**Objetivo:** Interface CLI para operacoes NEO

**Status:** [####] COMPLETO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SKILLS COMMANDS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] neo:skill:publish <path> │
│ └─ [ ] neo:skill:install <name@version> │
│ └─ [ ] neo:skill:list [--remote] │
│ └─ [ ] neo:skill:search <query> │
│ └─ [ ] neo:skill:verify <name@version> │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IDENTITY COMMANDS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] neo:identity:create --name "X" --role Y │
│ └─ [ ] neo:identity:list │
│ └─ [ ] neo:identity:verify <mio-id> │
│ └─ [ ] neo:identity:export <mio-id> │
│ └─ [ ] neo:identity:import <json-file> │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IPFS COMMANDS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] neo:ipfs:status │
│ └─ [ ] neo:ipfs:publish <path> │
│ └─ [ ] neo:ipfs:cat <cid> │
│ └─ [ ] neo:ipfs:pin <cid> │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ INFO COMMANDS │
├──────────────────────────────────────────────────────────┤
│ └─ [####] neo:info (JA IMPLEMENTADO) │
│ └─ [ ] neo:help │
│ └─ [ ] neo:version │
└──────────────────────────────────────────────────────────┘

**Deliverable:** CLI funcional para todas operacoes NEO

**Estimativa:** 2-3 dias

**Prioridade:** ALTA

---

## 1.5 Dependencies Setup

**Objetivo:** Instalar dependencias necessarias

**Status:** [#---] PENDENTE

**Tasks:**

```bash
pnpm add ipfs-http-client multiformats ethers
pnpm add -D @types/node
```

**Estimativa:** 1 dia

**Prioridade:** CRITICA

================================================================
FASE 2: EXTENSIONS (2 SEMANAS)
================================================================

---

## 2.1 IPFS Channel Adapter

**Objetivo:** Comunicacao via IPFS PubSub

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IMPLEMENTACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Criar neo/gateway/ipfs-channel.ts │
│ └─ [ ] Implementar IPFSChannelAdapter │
│ └─ [ ] Setup IPFS PubSub topics │
│ └─ [ ] Implementar message encryption (mio-identity) │
│ └─ [ ] Roteamento para gateway moltbot │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ TESTES │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: publish message │
│ └─ [ ] Teste: receive message │
│ └─ [ ] Teste: encryption/decryption │
│ └─ [ ] Teste: routing to gateway │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Mensagem enviada via IPFS PubSub

**Estimativa:** 5-6 dias

**Prioridade:** MEDIA

---

## 2.2 Web3 Signature System

**Objetivo:** Assinar mensagens/skills com mio-identity

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IMPLEMENTACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Criar neo/gateway/web3-signer.ts │
│ └─ [ ] Implementar Web3SignerExtension │
│ └─ [ ] Sign/verify skills no registry │
│ └─ [ ] Sign/verify gateway messages │
│ └─ [ ] Integracao com ledger (audit log) │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Skills assinadas e verificaveis

**Estimativa:** 3-4 dias

**Prioridade:** ALTA

---

## 2.3 Dashboard NEO Integration

**Objetivo:** UI para gerenciar NEO Protocol

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ UI COMPONENTS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Pagina: NEO Protocol │
│ └─ [ ] Pagina: Skills Registry │
│ └─ [ ] Pagina: Identities Manager │
│ └─ [ ] Pagina: IPFS Node Status │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ FEATURES │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Listar skills IPFS │
│ └─ [ ] Publish skill via UI │
│ └─ [ ] Listar mio-identities │
│ └─ [ ] Create identity via UI │
│ └─ [ ] IPFS stats dashboard │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Dashboard NEO funcional

**Estimativa:** 4-5 dias

**Prioridade:** MEDIA

---

## 2.4 Nostr Relay (Opcional)

**Objetivo:** Integracao com protocolo Nostr

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IMPLEMENTACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Pesquisar Nostr protocol │
│ └─ [ ] Criar neo/gateway/nostr-relay.ts │
│ └─ [ ] Implementar NostrRelayExtension │
│ └─ [ ] Testes basicos │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Prova de conceito Nostr

**Estimativa:** 3-4 dias

**Prioridade:** BAIXA (OPCIONAL)

================================================================
FASE 3: DOCUMENTATION (2 SEMANAS)
================================================================

---

## 3.1 NEO Docs Build

**Objetivo:** Documentacao self-hosted

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SETUP │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Criar docs-neo/ directory │
│ └─ [ ] Setup Vitepress (ou similar) │
│ └─ [ ] Configurar build static │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ CONTENT │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] protocol/architecture.md │
│ └─ [ ] protocol/identity.md │
│ └─ [ ] protocol/skills-registry.md │
│ └─ [ ] skills/ipfs.md │
│ └─ [ ] skills/asi1.md │
│ └─ [ ] skills/smart-factory.md │
│ └─ [ ] skills/flowpay.md │
│ └─ [ ] api/gateway.md │
│ └─ [ ] api/sdk.md │
│ └─ [ ] guides/quickstart.md │
│ └─ [ ] guides/telegram-setup.md │
│ └─ [ ] guides/whatsapp-setup.md │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Docs completos e builded

**Estimativa:** 6-8 dias

**Prioridade:** MEDIA

---

## 3.2 Deploy IPFS + DNS

**Objetivo:** Hospedar docs no IPFS

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ DEPLOY │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Build docs-neo/ static site │
│ └─ [ ] Upload para IPFS (ipfs add -r dist/) │
│ └─ [ ] Pin em 3+ nodes │
│ └─ [ ] Setup DNS: neo-docs.mello.eth │
│ └─ [ ] Configurar CI/CD auto-deploy │
└──────────────────────────────────────────────────────────┘

**Deliverable:** <https://neo-docs.mello.eth> live

**Estimativa:** 2-3 dias

**Prioridade:** BAIXA

================================================================
FASE 4: TESTING & RELEASE (2 SEMANAS)
================================================================

---

## 4.1 End-to-End Testing

**Objetivo:** Testes completos do NEO Protocol

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SKILLS REGISTRY │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: publish skill │
│ └─ [ ] Teste: install skill │
│ └─ [ ] Teste: search skill │
│ └─ [ ] Teste: verify signature │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ IDENTITY SYSTEM │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: create identity │
│ └─ [ ] Teste: verify identity │
│ └─ [ ] Teste: sign message │
│ └─ [ ] Teste: permissions system │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ GATEWAY EXTENSIONS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: IPFS channel send/receive │
│ └─ [ ] Teste: Web3 signature layer │
│ └─ [ ] Teste: routing to moltbot gateway │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ CLI COMMANDS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: neo:skill:_ commands │
│ └─ [ ] Teste: neo:identity:_ commands │
│ └─ [ ] Teste: neo:ipfs:\* commands │
│ └─ [ ] Teste: neo:info command │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ DASHBOARD │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Teste: skills registry UI │
│ └─ [ ] Teste: identity manager UI │
│ └─ [ ] Teste: IPFS status UI │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Suite de testes completa passando

**Estimativa:** 5-6 dias

**Prioridade:** ALTA

---

## 4.2 Security Audit

**Objetivo:** Auditoria de seguranca

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ MIO-IDENTITY │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Audit: key management │
│ └─ [ ] Audit: signature verification │
│ └─ [ ] Audit: permissions system │
│ └─ [ ] Teste: key rotation │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SKILLS REGISTRY │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Audit: signature verification │
│ └─ [ ] Audit: IPFS pinning security │
│ └─ [ ] Teste: malicious skill detection │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ GATEWAY EXTENSIONS │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Audit: sandboxing │
│ └─ [ ] Audit: message encryption │
│ └─ [ ] Teste: penetration testing │
└──────────────────────────────────────────────────────────┘

**Deliverable:** Relatorio de auditoria completo

**Estimativa:** 4-5 dias

**Prioridade:** CRITICA

---

## 4.3 Release NEO Protocol v1.0.0

**Objetivo:** Release publico

**Status:** [----] NAO INICIADO

**Tasks:**

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ PREPARACAO │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Atualizar README.md principal │
│ └─ [ ] Criar CHANGELOG_NEO.md │
│ └─ [ ] Atualizar package.json version │
│ └─ [ ] Tag version: v1.0.0-neo │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ PUBLISH │
├──────────────────────────────────────────────────────────┤
│ └─ [ ] Publish NEO SDK (npm) │
│ └─ [ ] Deploy docs-neo/ (IPFS) │
│ └─ [ ] Announce nos canais (Telegram, WhatsApp) │
│ └─ [ ] Criar release notes (GitHub) │
└──────────────────────────────────────────────────────────┘

**Deliverable:** NEO Protocol v1.0.0 publico

**Estimativa:** 2 dias

**Prioridade:** ALTA

================================================================
PROGRESS TRACKER
================================================================

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ OVERALL PROGRESS: 13/31 TASKS (42%) │
├──────────────────────────────────────────────────────────┤
│ └─ Fase 1 (Foundation): 13/15 ▓▓▓▓▓▓▓▓░░░░░ 87% │
│ └─ Fase 2 (Extensions): 0/8 ░░░░░░░░░░░░░░ 0% │
│ └─ Fase 3 (Documentation): 0/5 ░░░░░░░░░░░░░░ 0% │
│ └─ Fase 4 (Release): 0/3 ░░░░░░░░░░░░░░ 0% │
└──────────────────────────────────────────────────────────┘

================================================================
TIMELINE
================================================================

**Inicio:** 30 Janeiro 2026

**Fase 1 (Foundation):**

- Inicio: 30 Jan
- Fim: 13 Fev
- Duracao: 2 semanas

**Fase 2 (Extensions):**

- Inicio: 14 Fev
- Fim: 27 Fev
- Duracao: 2 semanas

**Fase 3 (Documentation):**

- Inicio: 28 Fev
- Fim: 13 Mar
- Duracao: 2 semanas

**Fase 4 (Release):**

- Inicio: 14 Mar
- Fim: 27 Mar
- Duracao: 2 semanas

**Release NEO Protocol v1.0.0:** 27 Marco 2026

================================================================
PROXIMOS PASSOS
================================================================

**IMEDIATO (Esta Semana):**

1. ✅ Instalar dependencias:

   ```bash
   pnpm add ipfs-http-client multiformats ethers
   ```

2. ✅ Gerar private keys (mio-system):

   ```bash
   node --import tsx scripts/generate-mio-keys.ts
   ```

   - Keys geradas e salvas em `.neo-identities/.env`
   - Backup no Bitwarden

3. ✅ Setup .env.neo (NUNCA COMMITAR!)
   - Pinata configurado
   - Gateway Pinata salvo
   - Index CID configurado

4. ✅ Implementar neo/registry/ipfs-client.ts
   - Registry completo implementado
   - Pinata integrado
   - CLI commands funcionando

5. ✅ Publicar primeira skill no IPFS
   - Index criado: QmdJp27vCm4UTRX7ov6FRu8jrUvxSXdMoAYyEZdWVF1Dz4
   - Skill publicada: neo-ipfs-status@1.0.0
   - CID: QmQNrCR4uGWfKY6sQAG5EnwDCSq1jYSuekzNoAYS8ymRhj

**PROXIMO (Proxima Semana):**

1. ✅ Implementar CLI commands (neo:skill:\*)
   - Commands funcionando: publish, install, list, index:create

2. ⏳ Publicar mais skills críticas no IPFS
   - Criar skill.json para: asi1-llm, smart-factory, flowpay
   - Publicar 2-3 skills adicionais
   - Objetivo: Registry com múltiplas skills funcionais

3. ⏳ Implementar MioIdentityManager
   - Ativar sistema de identidade Web3
   - Usar keys já geradas

4. ⏳ Ativar 9 identidades NEO
   - Usar private keys do .neo-identities/.env

5. ⏳ Testes end-to-end registry

================================================================
METRICAS DE AUTONOMIA
================================================================

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ COMPONENTE │ UPSTREAM │ NEO │ INDEPENDENTE │
├──────────────────────────────────────────────────────────┤
│ Gateway Runtime │ 100% │ 0% │ ❌ │
│ Channels │ 100% │ 0% │ ❌ │
│ Agent Runtime │ 100% │ 0% │ ❌ │
│ Skills Registry │ 0% │ 100% │ ✅ │
│ Identity System │ 0% │ 100% │ ✅ │
│ Documentation │ 0% │ 100% │ ✅ │
│ Dashboard │ 0% │ 100% │ ✅ │
│ Gateway Extensions │ 0% │ 100% │ ✅ │
├──────────────────────────────────────────────────────────┤
│ TOTAL │ 40% │ 60% │ 60% NEO │
└──────────────────────────────────────────────────────────┘

================================================================
CONSIDERACOES DE SEGURANCA
================================================================

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ CRITICO: PRIVATE KEYS │
├──────────────────────────────────────────────────────────┤
│ └─ NUNCA commitar .env.neo │
│ └─ NUNCA commitar private keys em qualquer formato │
│ └─ Adicionar .env.neo ao .gitignore │
│ └─ Usar hardware wallet em producao │
│ └─ Multi-sig para mio-core e mio-gateway │
│ └─ Rotacao de chaves trimestral │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ SKILLS REGISTRY │
├──────────────────────────────────────────────────────────┤
│ └─ SEMPRE verificar signature antes de instalar │
│ └─ Pinning redundante (3+ IPFS nodes) │
│ └─ Um node local + dois remotos (Infura, Pinata) │
│ └─ Verificacao de integridade (CID matching) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ GATEWAY EXTENSIONS │
├──────────────────────────────────────────────────────────┤
│ └─ Sandbox isolado por extensao │
│ └─ Permission system granular │
│ └─ Rate limiting por identity │
│ └─ Audit log completo (ledger integration) │
└──────────────────────────────────────────────────────────┘

================================================================
REFERENCIAS
================================================================

**Documentacao:**

- ARCHITECTURE_NEO_PROTOCOL.md (design completo)
- NEO_PROTOCOL_KICKOFF.md (resumo executivo)
- COMMIT_SUMMARY.md (commit strategy)

**Tecnologias:**

- IPFS Docs: <https://docs.ipfs.tech/>
- Ethers.js: <https://docs.ethers.org/>
- Flow Blockchain: <https://flow.com/developers>
- TypeBox: <https://github.com/sinclairzx81/typebox>

**Skills Implementadas (18):**

- ipfs, asi1, smart-factory, flowpay, telegram
- whatsapp, ops-status, health-check, ledger-tail
- identity-create, gateway-info, channel-status
- model-test, session-list, cron-list, webhook-test
- node-info, browser-control

================================================================
LICENCA
================================================================

**Moltbot Core (src/):** MIT License (upstream)
**NEO Protocol Layer (neo/, skills/, dashboard/):** MIT License

================================================================
COMMIT STRATEGY
================================================================

**NEO Layer commits:**

```bash
git commit -m "feat(neo): implement X"
git commit -m "fix(neo): resolve Y"
```

**Upstream sync commits:**

```bash
git commit -m "chore(upstream): merge moltbot core updates"
```

**Branches:**

```bash
# NEO features
git checkout -b neo/feature-xyz

# Upstream sync
git checkout -b upstream-sync
```

================================================================
CONTACT
================================================================

**Questions/Issues:**

- GitHub: <https://github.com/neomello/neobot>
- Telegram: @neoprotocol
- Email: neo@neoprotocol.space

┌─────────────────────────────────────────────────────────┐
│ ▓▓▓ NΞØ MELLØ │
│ Core Architect · NΞØ Protocol │
│ neo@neoprotocol.space │
│ │
│ "Code is law. Expand until chaos becomes protocol." │
│ │
│ Security by design. Exploits find no refuge here. │
└─────────────────────────────────────────────────────────┘
