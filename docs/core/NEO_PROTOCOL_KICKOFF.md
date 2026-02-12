# 🚀 NEO Protocol Stack - Kickoff

**Data:** 30 Janeiro 2026  
**Arquiteto:** NODE NEØ + Claude AI  
**Status:** ✅ Foundation Architecture Complete

---

## 🎯 Resumo Executivo

Você questionou corretamente: **"Até onde mantemos conexão com upstream moltbot?"**

**Resposta implementada:** Estratégia Híbrida (Opção 3)

### ✅ O que foi criado AGORA:

1. **ARCHITECTURE_NEO_PROTOCOL.md** (787 linhas)
   - Arquitetura completa do stack híbrido
   - Boundaries claros: Moltbot Core vs NEO Layer
   - Estratégia de sincronização
   - Roadmap detalhado (4 fases, 8 semanas)

2. **NEXT_STEPS.md atualizado**
   - Fase 0.1 completa (14/14 tasks)
   - Fase 1.0 NEO Protocol iniciada (0/31 tasks)
   - Timeline: Release v1.0.0 em ~27 Março 2026

3. **neo/ Directory Structure** (esqueleto funcional)

` ```
   neo/
   ├── README.md
   ├── registry/index.ts      # IPFS Skills Registry
   ├── identity/
   │   ├── mio-system.ts      # Identity Manager
   │   └── registry.ts        # 9 identidades NEO
   ├── sdk/index.ts           # Public SDK
   └── cli/info.ts            # Comando neo:info
```

---

## 🔷 Estratégia Híbrida Explicada

### ⬆️ MANTEMOS SINCRONIZADO (40%)

**Diretório:** `src/` (core only)

**O que é:**
- Gateway WebSocket runtime
- Channel adapters (WhatsApp, Telegram, Slack, etc)
- Agent runtime (Pi RPC)
- Tool execution engine
- Session management
- Media pipeline

**Como sincronizamos:**
```bash
git remote add upstream git@github.com:moltbot/moltbot.git
git fetch upstream main
git merge upstream/main --strategy-option theirs src/
```

**Por quê mantemos?**
- Bugfixes automáticos do upstream
- Novos channels (Discord, Matrix, etc)
- Melhorias de performance
- Security patches
- Estabilidade testada pela comunidade

---

### 🔷 DESACOPLAMOS (60% - NEO LAYER)

**Diretório:** `neo/`, `skills/`, `dashboard/`, `docs-neo/`

#### 1. **NEO Skills Registry** (IPFS-First)

**Substitui:** ClawdHub (https://clawdhub.com)

**Arquitetura:**
```
IPFS: QmNeoSkillsIndex
├── skills/
│   ├── ipfs-status/v1.0.0 → QmXxx...
│   ├── asi1-llm/v1.2.0 → QmYyy...
│   ├── smart-factory/v2.0.0 → QmZzz...
│   └── ...
└── index.json
```

**CLI:**
```bash
pnpm neobot neo:skill:publish ./skills/ipfs/
pnpm neobot neo:skill:install ipfs-status@1.0.0
pnpm neobot neo:skill:list
```

**Vantagens:**
- ✅ 100% descentralizado (sem depender de molt.bot servers)
- ✅ Content-addressed (imutável, verificável)
- ✅ Pinning redundante (3+ nodes)
- ✅ Skills assinadas cryptographically

---

#### 2. **mio-system Identity** (Web3-Native)

**Substitui:** Auth tradicional

**9 Identidades NEO:**
```
mio-core       → Sistema principal
mio-gateway    → Gateway manager
mio-skills     → Skills registry
mio-factory    → Smart Factory (Flow)
mio-flowpay    → FlowPay system
mio-asi1       → ASI1 LLM local
mio-telegram   → Telegram bot
mio-whatsapp   → WhatsApp gateway
mio-ipfs       → IPFS node
```

**Arquitetura:**
```typescript
// Cada identidade possui:
interface NeoIdentity {
  id: string              // mio-abc12345
  publicKey: string       // Ethereum address
  roles: string[]         // ["system", "gateway"]
  permissions: {...}      // Granular permissions
  signature: string       // Web3 signature
}
```

**CLI:**
```bash
pnpm neobot neo:identity:create --name "My Bot"
pnpm neobot neo:identity:list
pnpm neobot neo:identity:verify mio-abc123
```

**Vantagens:**
- ✅ Self-sovereign (você controla as chaves)
- ✅ Cryptographically verifiable
- ✅ Permissões granulares
- ✅ Multi-sig support futuro

---

#### 3. **NEO Docs** (Self-Hosted IPFS)

**Substitui:** https://docs.molt.bot

**Deploy:**
```bash
cd docs-neo
pnpm build
ipfs add -r dist/
# CID: QmNeoDocs...

# DNS alias
neo-docs.mellø.eth → ipfs://QmNeoDocs...
```

**Vantagens:**
- ✅ Sem depender de molt.bot infrastructure
- ✅ Versionado (cada build tem CID único)
- ✅ Resiliente (IPFS pinning)
- ✅ Ownership total

---

#### 4. **Gateway Extensions** (Web3 Channels)

**Novos canais descentralizados:**
- IPFS PubSub Channel (mensagens via IPFS)
- Nostr Relay Integration (opcional)
- Web3 Signature Layer (assinar mensagens)

**Exemplo: IPFS Channel**
```typescript
class IPFSChannelAdapter {
  async send(to: string, message: string) {
    await ipfs.pubsub.publish('neo-protocol', {
      from: 'mio-gateway',
      to,
      content: message,
      signature: await sign(message)
    })
  }
}
```

**Vantagens:**
- ✅ Comunicação P2P sem servers centrais
- ✅ Censorship-resistant
- ✅ Privacy-preserving

---

#### 5. **Dashboard NEO** (Já Existe!)

**Localização:** `dashboard/`

**Status:** ✅ Implementado (iOS-style UI)

**Melhorias necessárias:**
- [ ] Integrar NEO Skills Registry UI
- [ ] Mostrar mio-identities
- [ ] IPFS node status dashboard
- [ ] Skill publish via UI

---

## 📊 Métricas de Autonomia

| Componente         | Upstream | NEO | Independente? |
|-------------------|----------|-----|---------------|
| Gateway Runtime   | 100%     | 0%  | ❌ Dependente |
| Channels          | 100%     | 0%  | ❌ Dependente |
| Agent Runtime     | 100%     | 0%  | ❌ Dependente |
| **Skills Registry** | 0%     | 100%| ✅ **INDEPENDENTE** |
| **Identity System** | 0%     | 100%| ✅ **INDEPENDENTE** |
| **Documentation**   | 0%     | 100%| ✅ **INDEPENDENTE** |
| **Dashboard**       | 0%     | 100%| ✅ **INDEPENDENTE** |
| **Extensions**      | 0%     | 100%| ✅ **INDEPENDENTE** |
| **TOTAL**         | **40%**  | **60%** | 🎯 **60% Autonomia** |

---

## 🛣️ Roadmap (8 Semanas)

### Fase 1: Foundation (Semanas 1-2)
**Tasks:** 0/15 ⬜⬜⬜⬜⬜

- [ ] Implementar NEO Skills Registry (IPFS)
- [ ] Implementar mio-system Identity
- [ ] Migrar 18 skills para IPFS
- [ ] CLI commands (neo:*)
- [ ] SDK público

**Deliverable:** Primeira skill publicada no IPFS + 9 identidades ativas

---

### Fase 2: Extensions (Semanas 3-4)
**Tasks:** 0/8 ⬜⬜⬜⬜⬜

- [ ] IPFS Channel Adapter
- [ ] Web3 Signature System
- [ ] Dashboard NEO integration
- [ ] Nostr Relay (opcional)

**Deliverable:** Mensagem enviada via IPFS PubSub

---

### Fase 3: Documentation (Semanas 5-6)
**Tasks:** 0/5 ⬜⬜⬜⬜⬜

- [ ] Build docs-neo/
- [ ] Deploy IPFS + DNS
- [ ] API reference NEO
- [ ] Migration guides

**Deliverable:** https://neo-docs.mellø.eth live

---

### Fase 4: Release (Semanas 7-8)
**Tasks:** 0/3 ⬜⬜⬜⬜⬜

- [ ] E2E testing
- [ ] Security audit
- [ ] Release v1.0.0

**Deliverable:** 🚀 NEO Protocol v1.0.0 público

---

## 🚀 Próximos Passos Imediatos

### 1. Dependências Node (adicionar ao package.json)

```bash
pnpm add ipfs-http-client multiformats ethers
pnpm add -D @types/node
```

### 2. Setup .env (identidades mio-system)

```bash
# .env.neo (NUNCA COMMITAR!)

# mio-system private keys (gerar com ethers)
MIO_CORE_PRIVATE_KEY=0x...
MIO_GATEWAY_PRIVATE_KEY=0x...
MIO_SKILLS_PRIVATE_KEY=0x...
MIO_FACTORY_PRIVATE_KEY=0x...
MIO_FLOWPAY_PRIVATE_KEY=0x...
MIO_ASI1_PRIVATE_KEY=0x...
MIO_TELEGRAM_PRIVATE_KEY=0x...
MIO_WHATSAPP_PRIVATE_KEY=0x...
MIO_IPFS_PRIVATE_KEY=0x...

# IPFS config
IPFS_ENDPOINT=https://ipfs.infura.io:5001
NEO_SKILLS_INDEX_CID=Qm... # Will be generated
```

### 3. Gerar Private Keys

```typescript
// scripts/generate-mio-keys.ts
import { ethers } from 'ethers'

for (let i = 0; i < 9; i++) {
  const wallet = ethers.Wallet.createRandom()
  console.log(`MIO_KEY_${i}=${wallet.privateKey}`)
  console.log(`Address: ${wallet.address}`)
  console.log(`mio-id: mio-${wallet.address.slice(2, 10).toLowerCase()}`)
  console.log('---')
}
```

### 4. Implementar Fase 1.1 (Esta semana)

```bash
# Criar estrutura completa
mkdir -p neo/{registry,identity,gateway,cli}

# Implementar IPFS client
# Ver: neo/registry/index.ts (TODO markers)

# Implementar Identity Manager
# Ver: neo/identity/mio-system.ts (TODO markers)

# Adicionar comandos CLI
# Ver: neo/cli/info.ts (já funcional)
```

### 5. Testar comando neo:info

```bash
# Adicionar ao package.json scripts:
"neo:info": "node --import tsx neo/cli/info.ts"

# Executar:
pnpm neo:info
```

---

## 🔐 Considerações de Segurança

### ⚠️ CRÍTICO: Private Keys

**NUNCA COMMITAR:**
- `.env.neo`
- Private keys em qualquer formato
- Wallets ou keystores

**Recomendado:**
```bash
# .gitignore (adicionar)
.env.neo
neo/**/*.key
*.wallet
```

**Produção:**
- Usar hardware wallet (Ledger, Trezor)
- Multi-sig para mio-core, mio-gateway
- Rotação de chaves trimestral

---

### 🛡️ Skills Registry Security

**Verificação obrigatória:**
```typescript
// Antes de instalar uma skill
const skill = await registry.install('skill-name@1.0.0')

// SEMPRE verificar assinatura
const isValid = await registry.verify(skill)
if (!isValid) {
  throw new Error('Skill signature invalid!')
}
```

**Pinning:**
- Manter 3+ IPFS nodes
- Um node local (ipfs daemon)
- Dois nodes remotos (Infura, Pinata)

---

## 📚 Referências Técnicas

- [IPFS Docs](https://docs.ipfs.tech/)
- [IPFS HTTP Client](https://www.npmjs.com/package/ipfs-http-client)
- [Ethers.js](https://docs.ethers.org/)
- [Flow Blockchain](https://flow.com/developers)
- [TypeBox](https://github.com/sinclairzx81/typebox)

---

## 🤝 Colaboração

### Commits

```bash
# Commits NEO layer
git commit -m "feat(neo): implement skills registry IPFS"
git commit -m "feat(neo): add mio-identity manager"

# Commits Moltbot core (raros)
git commit -m "fix(gateway): upstream bugfix merge"
```

### Branches

```bash
# NEO features
git checkout -b neo/feature-xyz

# Upstream sync
git checkout -b upstream-sync
```

---

## 💡 Filosofia NEO Protocol

**Princípios Web3:**
1. **Descentralização** - Sem single points of failure
2. **Self-Sovereignty** - Você controla suas chaves
3. **Transparency** - Código aberto, auditável
4. **Resilience** - IPFS, multi-node, redundância
5. **Privacy** - Local-first, encrypted quando necessário

**Balance:**
- 40% Moltbot Core (estabilidade, channels, agent runtime)
- 60% NEO Layer (autonomia, descentralização, ownership)

**Resultado:**
- ✅ Stability do upstream
- ✅ Autonomy do NEO
- ✅ Best of both worlds

---

## 🎯 Decisão Final

**Você tem agora:**

1. ✅ Arquitetura híbrida clara (ARCHITECTURE_NEO_PROTOCOL.md)
2. ✅ Roadmap detalhado (NEXT_STEPS.md)
3. ✅ Estrutura base implementada (neo/ directory)
4. ✅ Boundaries bem definidos (src/ vs neo/)
5. ✅ Estratégia de sync com upstream (git workflow)

**Próximo passo:** Escolher uma task da Fase 1 e começar implementação.

**Recomendação:** Começar por **1.2 NEO Skills Registry (IPFS)**

Porque:
- É o componente mais crítico
- Valida a viabilidade técnica do IPFS
- Permite migrar as 18 skills existentes
- Base para todos os outros componentes

**Timeline:** 5-7 dias de implementação focada.

---

**Perguntas?**

1. Começamos pela Skills Registry (IPFS)?
2. Você quer revisar a arquitetura antes?
3. Alguma preocupação de segurança?
4. Timeline muito agressivo?

**Status:** ⏳ Aguardando seu go/no-go para Fase 1.2

---

**Mantido por:** NODE NEØ (@neomello)  
**Versão NEO:** 1.0.0-alpha  
**Última atualização:** 30 Jan 2026 21:00 BRT
