# 📱 AUDIT: ceo-escalavel-miniapp vs smart-ui-mobile

**Data:** 29 Janeiro 2026  
**Node Arquiteto:** Mellø

---

## 🚨 DESCOBERTA CRÍTICA: OVERLAP TOTAL!

Ambos projetos são **MiniApps Telegram** com funcionalidade similar. **Consolidação necessária.**

---

## 📊 Comparativo Técnico

| Aspecto | ceo-escalavel-miniapp | smart-ui-mobile |
|---------|----------------------|-----------------|
| **Framework** | React 19.2.3 + Vite | Vue 3.4.0 + Vite |
| **Web3** | Wagmi 3.3.4 + viem 2.44.4 | TON Connect + ethers 6.16.0 |
| **Network** | Base (EVM) | TON + EVM (dual) |
| **Foco** | Idle game + Web3 | Token Factory UI |
| **Deploy** | Vercel | Vercel |
| **Arquivos** | 96 (20 TSX, 4 API JS) | ~60 (Vue SFCs, 6 composables) |
| **Status** | 🟢 Completo (gamificado) | 🟢 v0.6.0 (factory) |
| **Docs** | 9 MD files | 14 MD files |
| **Blockchain** | @reown/appkit (WalletConnect) | @tonconnect/ui + Web3Modal |

---

## 🎮 ceo-escalavel-miniapp

### Funcionalidades
✅ **Idle Game Mechanics**
- XP/Level system
- Offline earnings
- Daily tasks
- Prestige system
- Leaderboard
- Store (agents, boosts)

✅ **Web3 Integration**
- NeoTokenV2 (Base L2)
- Mint/Burn tokens
- Withdraw (game → wallet)
- WalletConnect v3

✅ **Telegram Native**
- WebApp SDK
- Cloud storage sync
- Payment integration (Stars)
- Deep linking

✅ **UI/UX**
- Neo Terminal (ASCII art)
- X-Ray visual
- Agent cards
- Modals (10 components)
- Sound effects

### Stack
- **Frontend:** React 19, TypeScript, Vite 6
- **Web3:** Wagmi 3, viem 2, @reown/appkit 1.8
- **Blockchain:** Base L2 (EVM)
- **Query:** @tanstack/react-query 5.90
- **Storage:** @vercel/kv 3.0
- **Monitoring:** @vercel/otel 2.1

### Arquitetura
```
ceo-escalavel-miniapp/
├── App.tsx (main game)
├── components/ (17 componentes)
│   ├── AgentStore.tsx
│   ├── NeoMintModal.tsx
│   ├── WithdrawModal.tsx
│   └── ... (10 modals)
├── engine/
│   ├── gameLogic.ts (core mechanics)
│   └── soundEffects.ts
├── blockchain/
│   ├── config.ts (Base L2)
│   └── Web3Provider.tsx (Wagmi)
├── api/ (4 Netlify functions)
│   ├── create-invoice.js
│   ├── webhook.js
│   └── ...
├── constants/
│   └── abis/NeoTokenV2.json
└── docs/ (9 guides)
```

### Docs
- `BUSINESS_PITCH.md` - Pitch deck
- `DEPLOYMENT_HISTORY.md` - Deploy logs
- `MARKETING_KIT.md` - Marketing assets
- `PRIVACY_POLICY.md` - Privacy
- `ROADMAP_WEB3.md` - Web3 roadmap
- `TECH_OVERVIEW.md` - Tech stack
- `TELEGRAM_LAUNCH_GUIDE.md` - Launch checklist

---

## 🏭 smart-ui-mobile

### Funcionalidades
✅ **Token Factory UI**
- Step-by-step wizard
- Token metadata form
- Jetton deployment (TON)
- ERC20 deployment (EVM)
- Share certificate

✅ **Multi-Chain**
- TON blockchain (primary)
- EVM chains (Base, Polygon)
- TON Connect wallet
- Web3Modal (EVM)

✅ **Telegram Native**
- WebApp SDK
- Cloud storage
- Draft saving
- Deep linking

✅ **UI/UX**
- 5 components (Step-based)
- Cloud upload
- Share card generator
- Result certificate

### Stack
- **Frontend:** Vue 3.4, Vite 7, TypeScript
- **Web3 TON:** @ton/core 0.63, @tonconnect/ui 2.3
- **Web3 EVM:** ethers 6.16, @web3modal/ethers 5.1
- **State:** Pinia 2.1
- **Utils:** @vueuse/core 10.7

### Arquitetura
```
smart-ui-mobile/
├── src/
│   ├── App.vue (wizard flow)
│   ├── components/ (5 steps)
│   │   ├── StepLanding.vue
│   │   ├── StepForm.vue
│   │   ├── StepResult.vue
│   │   └── ...
│   ├── composables/ (6 hooks)
│   │   ├── useJettonFactory.js (TON deploy)
│   │   ├── useTon.js
│   │   ├── useWeb3.js (EVM)
│   │   └── ...
│   └── stores/
│       └── protocol.js (Pinia)
├── api/
│   └── auth.js
├── public/
│   └── brand/ (logos)
└── docs/ (14 guides)
```

### Docs
- `JETTON_DEPLOYMENT_GUIDE.md` - TON deploy
- `NEO_JETTON_V1.md` - Jetton spec
- `SECURITY_AUDIT.md` - Security
- `CONFIGURATION_GUIDE.md` - Config
- `estrategia-implementacao-miniapp/` (3 strategy docs)

---

## 💥 Análise de Overlap

### Funcionalidades Duplicadas
| Feature | ceo-escalavel | smart-ui |
|---------|---------------|----------|
| Telegram MiniApp | ✅ | ✅ |
| Cloud Storage | ✅ | ✅ |
| Token Minting | ✅ (NeoTokenV2) | ✅ (Factory) |
| Web3 Wallet | ✅ (WalletConnect) | ✅ (TON + Web3Modal) |
| Multi-chain | ✅ (Base) | ✅ (TON + Base) |
| Share/Certificate | ✅ (SingularityCertificate) | ✅ (ShareCard) |

### Diferenças Chave
| Aspecto | ceo-escalavel | smart-ui |
|---------|---------------|----------|
| **Propósito** | Idle game (earn tokens) | Token factory (create tokens) |
| **Gameplay** | ✅ (XP, levels, prestige) | ❌ (only wizard) |
| **Complexidade** | Alta (17 components, game logic) | Baixa (5 steps) |
| **Gamificação** | ✅ (leaderboard, daily tasks) | ❌ |
| **TON Native** | ❌ (EVM only) | ✅ (Jetton primary) |

---

## 🎯 Recomendação: CONSOLIDAR

### Opção A: Merge Smart Factory em CEO Escalável (RECOMENDADO)
**Ação:**
1. Adicionar "Factory" tab/modal no ceo-escalavel
2. Migrar `useJettonFactory` para ceo-escalavel
3. Unificar docs
4. Manter gamificação + factory juntos
5. **Nome final:** "NEØ MiniApp" (unified)

**Vantagens:**
- 1 codebase, 1 deploy
- Usuário ganha tokens jogando E cria tokens
- Experiência completa

**Desvantagens:**
- App maior (bundle size)
- Complexidade aumenta

---

### Opção B: Separar por Público
**Ação:**
1. **ceo-escalavel:** Para usuários (earn tokens)
2. **smart-ui:** Para devs (create tokens)
3. Cross-link entre apps
4. Branding diferente

**Vantagens:**
- Apps focados
- Bundles menores
- Públicos diferentes

**Desvantagens:**
- 2 codebases para manter
- Usuário precisa trocar de app

---

### Opção C: Manter smart-ui Standalone (NÃO RECOMENDADO)
**Ação:**
- Descontinuar ceo-escalavel
- Focar em smart-ui (Factory)

**Razão para NÃO:**
- ceo-escalavel tem gamificação única
- Leaderboard é engajamento alto
- Já tem tração (se lançado)

---

## ✅ DECISÃO FINAL: Opção A (Merge)

### Roadmap de Consolidação

#### Fase 1: Preparação (Esta Semana)
- [ ] Backup de ambos projetos
- [ ] Análise de dependências conflitantes
- [ ] Decisão de framework (React vs Vue?)
- [ ] Plano de migração

#### Fase 2: Merge Técnico (Próxima Semana)
- [ ] Criar branch `merge-factory` em ceo-escalavel
- [ ] Migrar componentes smart-ui para React
- [ ] Integrar `useJettonFactory` como React hook
- [ ] Adicionar "Factory" tab na Navigation
- [ ] Testar TON Connect + Wagmi juntos

#### Fase 3: UI/UX (Semana 3)
- [ ] Unificar design system
- [ ] Adicionar Factory no menu principal
- [ ] Flow: Earn tokens → Create tokens
- [ ] Share certificate unified

#### Fase 4: Deploy (Semana 4)
- [ ] Build consolidado
- [ ] Testes Telegram WebApp
- [ ] Launch em production
- [ ] Sunset smart-ui-mobile

---

## 🚀 Nova Arquitetura (NEØ MiniApp Unified)

```
neo-miniapp-unified/
├── src/
│   ├── App.tsx (main)
│   ├── components/
│   │   ├── game/ (17 componentes ceo-escalavel)
│   │   └── factory/ (5 componentes smart-ui migrados)
│   ├── composables/
│   │   ├── useGameLogic.ts (idle game)
│   │   ├── useJettonFactory.ts (TON deploy)
│   │   ├── useNeoToken.ts (Base EVM)
│   │   └── useTelegram.ts (unified)
│   ├── blockchain/
│   │   ├── evm/ (Wagmi + viem)
│   │   └── ton/ (TON Connect)
│   └── pages/
│       ├── GamePage.tsx (earn)
│       ├── FactoryPage.tsx (create)
│       └── ProfilePage.tsx (unified)
└── docs/ (consolidados)
```

### Features Finais
✅ Idle game mechanics (XP, levels, prestige)  
✅ Leaderboard  
✅ Daily tasks  
✅ Token factory (Jetton + ERC20)  
✅ Multi-chain (TON + Base)  
✅ Unified wallet (TON Connect + WalletConnect)  
✅ Share certificate  
✅ Cloud sync  
✅ Telegram payments  

---

## 📋 Ação Imediata

**Próximos passos:**
1. ✅ Documentar overlap (feito)
2. ⏳ Decidir framework (React ou Vue?)
3. ⏳ Criar branch `neo-miniapp-unified`
4. ⏳ Migrar componentes
5. ⏳ Testar integração

**Bloqueador:** Mellø decidir framework final (React ou Vue?)

**Recomendação:** **React** (ceo-escalavel)
- Mais maduro (19.2.3)
- Wagmi ecosystem melhor
- React Query para state
- Já tem gamificação pronta

---

**Status:** ✅ Análise completa  
**Decisão:** 🟡 Aguardando confirmação de Mellø para iniciar merge

---
