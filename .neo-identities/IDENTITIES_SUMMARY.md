# NEO Protocol - Identities Summary

**Data de Geração:** 2026-01-30T04:01:50.215Z

## Identidades Criadas


### mio-core - System Core

- **mio-ID:** `mio-0e2106ba`
- **Public Key:** `0x0E2106Ba425B78CD3D92662475408005017ffbbA`
- **Roles:** System Core
- **Permissions:**
  - Channels: *
  - Skills: *
  - Tools: *
- **Created:** 2026-01-30T04:01:50.082Z

**Metadata:**
- Name: NEO Core System
- Bio: Sistema principal do protocolo NEO. Gerencia inicialização, health checks e coordenação geral.

---


### mio-gateway - Gateway Manager

- **mio-ID:** `mio-a4e1a8b3`
- **Public Key:** `0xa4e1A8b3b2dFd8fD1342d9E5cf1312b09E9e0DD8`
- **Roles:** Gateway Manager
- **Permissions:**
  - Channels: *
  - Skills: *
  - Tools: routing, sessions, websocket
- **Created:** 2026-01-30T04:01:50.116Z

**Metadata:**
- Name: NEO Gateway
- Bio: Gerenciador de canais, roteamento e sessões. Interface principal entre usuários e o protocolo.

---


### mio-skills - Skills Registry

- **mio-ID:** `mio-b1dd5e2d`
- **Public Key:** `0xb1dd5e2df26D9D350869287B5462128996690ec6`
- **Roles:** Skills Registry
- **Permissions:**
  - Channels: none
  - Skills: *
  - Tools: ipfs, read, write
- **Created:** 2026-01-30T04:01:50.128Z

**Metadata:**
- Name: NEO Skills Manager
- Bio: Gerenciador do registro descentralizado de skills (IPFS). Publica, instala e verifica skills.

---


### mio-factory - Smart Factory

- **mio-ID:** `mio-3aff112a`
- **Public Key:** `0x3AfF112a0E6193229C15684cB17227d0637BCFAe`
- **Roles:** Smart Factory
- **Permissions:**
  - Channels: telegram, whatsapp
  - Skills: smart-factory
  - Tools: blockchain, deploy, mint, read
- **Created:** 2026-01-30T04:01:50.140Z

**Metadata:**
- Name: Smart Factory Manager
- Bio: Gerenciador de contratos inteligentes na Flow Blockchain. Deploy, mint e verificação de NFTs.

---


### mio-flowpay - FlowPay System

- **mio-ID:** `mio-02470998`
- **Public Key:** `0x02470998A21D047BCE2CF696b14705349eB297Ad`
- **Roles:** FlowPay System
- **Permissions:**
  - Channels: telegram, whatsapp
  - Skills: flowpay
  - Tools: blockchain, read, tokens, transactions
- **Created:** 2026-01-30T04:01:50.149Z

**Metadata:**
- Name: FlowPay Manager
- Bio: Sistema de pagamentos e gestão de tokens Flow. Compra, venda e transferências.

---


### mio-asi1 - ASI1 LLM

- **mio-ID:** `mio-d4c70a50`
- **Public Key:** `0xd4C70A50F37570b17fDaad54a3b3bA78BA8e97DA`
- **Roles:** ASI1 LLM
- **Permissions:**
  - Channels: telegram, whatsapp
  - Skills: asi1-llm
  - Tools: ai, inference, read
- **Created:** 2026-01-30T04:01:50.159Z

**Metadata:**
- Name: ASI1 LLM Agent
- Bio: Modelo de linguagem local (llama.cpp). Inferência AI descentralizada e privada.

---


### mio-telegram - Telegram Bot

- **mio-ID:** `mio-d28e1ea1`
- **Public Key:** `0xD28E1EA1ea98A61f44ca0887ec07b3F6641D820e`
- **Roles:** Telegram Bot
- **Permissions:**
  - Channels: telegram
  - Skills: telegram
  - Tools: messaging, read, write
- **Created:** 2026-01-30T04:01:50.174Z

**Metadata:**
- Name: NEO Telegram
- Bio: Bot Telegram oficial do protocolo NEO. Interface de comandos e automações.

---


### mio-whatsapp - WhatsApp Gateway

- **mio-ID:** `mio-725d0c58`
- **Public Key:** `0x725d0c5885D34238B70DE8901AE435737f5a6061`
- **Roles:** WhatsApp Gateway
- **Permissions:**
  - Channels: whatsapp
  - Skills: whatsapp
  - Tools: media, messaging, read, write
- **Created:** 2026-01-30T04:01:50.190Z

**Metadata:**
- Name: NEO WhatsApp
- Bio: Gateway WhatsApp do protocolo NEO. Comunicação end-to-end encrypted.

---


### mio-ipfs - IPFS Node

- **mio-ID:** `mio-92558a7e`
- **Public Key:** `0x92558a7e3caf349Ba1552e767a2a0CCBDE53e418`
- **Roles:** IPFS Node
- **Permissions:**
  - Channels: none
  - Skills: ipfs
  - Tools: ipfs, pinning, pubsub, storage
- **Created:** 2026-01-30T04:01:50.199Z

**Metadata:**
- Name: NEO IPFS
- Bio: Nó IPFS descentralizado. Armazenamento, pinning e comunicação via PubSub.

---


## Como Usar

### 1. Carregar Private Keys

```typescript
import { config } from 'dotenv'
import { MioIdentityManager } from './neo/identity/mio-system'

// Carregar .env
config({ path: '.neo-identities/.env' })

// Criar manager para cada identidade
const coreManager = new MioIdentityManager(
  process.env.NEO_CORE_PRIVATE_KEY!
)
```

### 2. Usar Identidade

```typescript
// Assinar mensagem
const signature = await coreManager.signMessage('Hello NEO')

// Verificar identidade
const identity = JSON.parse(
  await fs.readFile('.neo-identities/mio-core.json', 'utf-8')
)

const isValid = await coreManager.verifyIdentity(identity)
```

### 3. Backup em 1Password

```bash
# Criar item no 1Password
op item create \
  --category=Login \
  --title="NEO Protocol Identities" \
  --vault="Personal" \
  "Private Keys[password]=$(cat .neo-identities/.env)"

# Recuperar
op item get "NEO Protocol Identities" --fields "Private Keys"
```

## ⚠️ Segurança

1. **NUNCA commite** o arquivo `.env` com private keys
2. **Faça backup** em 1Password ou similar
3. **Rotacione keys** regularmente (a cada 6 meses)
4. **Use .env** apenas em desenvolvimento
5. **Em produção**, use secrets manager (AWS Secrets, etc)

## Arquivo .gitignore

Certifique-se que `.neo-identities/.env` está no `.gitignore`:

```
.neo-identities/.env
.env
*.pem
*.key
```
