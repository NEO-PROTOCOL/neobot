# 🤖 Telegram Bot Integration

**Versão:** 1.0.0  
**Status:** ✅ Ativo  
**Autor:** NEØ Protocol

---

## 📖 Descrição

Integração completa do Telegram Bot com todas as skills do NEØ Protocol. Permite controlar Smart Factory, FlowPay, Notion e outros serviços via comandos de chat.

---

## 🎯 Casos de Uso

### 1. Monitoramento

- `/status` - Status geral do ecossistema
- `/projetos` - Lista de projetos no Notion
- `/factory status` - Status da Smart Factory
- `/flowpay status --recent` - Transações recentes

### 2. Operações

- `/factory deploy --network base` - Deploy de contratos
- `/factory mint --amount 1000 --to 0x...` - Mint tokens
- `/flowpay buy --amount 100 --token NEOFLW` - Comprar tokens

### 3. Gestão

- `/log <mensagem>` - Adicionar work log no Notion
- `/task` - Ver tarefas pendentes
- `/agent` - Status do neo-agent-full

---

## 🚀 Setup

### 1. Configurar Token

O token já está em `.env`:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 2. Iniciar Bot

```bash
cd /Users/nettomello/CODIGOS/neobot
pnpm moltbot telegram start
```

ou diretamente:

```bash
tsx skills/telegram/bot.ts
```

### 3. Testar

Abra Telegram e envie `/start` para o bot.

---

## 📋 Comandos Disponíveis

### Básicos

| Comando | Descrição |
|---------|-----------|
| `/start` | Iniciar bot |
| `/help` | Ajuda |
| `/status` | Status geral |

### Smart Factory

| Comando | Descrição |
|---------|-----------|
| `/factory status` | Status de deployments |
| `/factory status --network base` | Status específico |
| `/factory deploy --network base` | Deploy em Base L2 |
| `/factory mint --amount N --to 0x...` | Mint tokens |
| `/factory bridge --from base --to polygon --amount N` | Bridge cross-chain |

### FlowPay

| Comando | Descrição |
|---------|-----------|
| `/flowpay status --recent` | Transações recentes |
| `/flowpay status --tx TX-123...` | Status de TX específica |
| `/flowpay buy --amount 100 --token NEOFLW` | Comprar tokens |

### Notion

| Comando | Descrição |
|---------|-----------|
| `/log <mensagem>` | Adicionar work log |
| `/projetos` | Listar projetos |
| `/task` | Ver tarefas |

---

## 🔧 Arquitetura

```
skills/telegram/
├── bot.ts              # Main bot listener
├── SKILL.md            # Esta documentação
└── commands/           # (Futuro) Command modules
    ├── factory.ts      # Smart Factory commands
    ├── flowpay.ts      # FlowPay commands
    ├── notion.ts       # Notion commands
    └── system.ts       # System commands
```

### Fluxo de Comando

```
Usuário → Telegram
    ↓
Bot listener (bot.ts)
    ↓
Parse comando + args
    ↓
Execute Neobot skill (pnpm moltbot ...)
    ↓
Retorna resultado → Telegram
```

---

## 🔗 Integrações

### NEØ Protocol Skills
- ✅ `smart-factory/` (deploy, mint, bridge, status)
- ✅ `flowpay/` (buy, status)
- 🟡 `notion/` (log, tasks) [Parcial]
- ⏳ `ipfs/` (upload, fetch) [TODO]

### Notion API
- Work Log automático
- Projetos sync
- Tasks tracking

### Notificações Push
- Deploy completo
- PIX confirmado
- Mint executado
- Bridge finalizado

---

## 📊 Exemplos de Uso

### Exemplo 1: Check Status
```
👤 /status
🤖 ⏳ Checking status...
🤖 📊 NEØ Protocol Status:

🔵 BASE
✅ Deployed
Token: 0x...
Balance: 1,100 NEOFLW

🟣 POLYGON
❌ Not deployed
💡 Deploy: pnpm moltbot factory deploy --network polygon
```

### Exemplo 2: Mint Tokens
```
👤 /factory mint --amount 10000 --to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
🤖 ⏳ Executing factory command...
🤖 🏭 Smart Factory:

🔨 Minting tokens...
✅ Mint successful!

📊 Next steps:
   1. Check balance: pnpm moltbot factory status
```

### Exemplo 3: Buy Tokens via PIX
```
👤 /flowpay buy --amount 100 --token NEOFLW
🤖 ⏳ Executing FlowPay command...
🤖 💳 FlowPay:

💰 Purchase Summary:
Amount: R$ 100.00
Token: NEOFLW
Estimated: 181.82 NEOFLW

📱 PIX QR Code: [image]
📋 Copy-Paste: 00020126580014br.gov.bcb.pix...
⏱️  Expires in: 30 minutes
```

---

## 🔔 Notificações Automáticas

O bot envia notificações automáticas para eventos importantes:

### Deploy Completo
```
✅ Smart Factory Deployed!

Network: Base L2
Token: 0x...
Verified: ✅

Next: Add liquidity
```

### PIX Confirmado
```
💰 PIX Payment Confirmed!

Amount: R$ 100.00
Tokens: 181.82 NEOFLW
Wallet: 0x742d...

Minting tokens...
```

### Mint Executado
```
🎉 Tokens Minted!

Amount: 10,000 NEOFLW
To: 0x742d...
TxHash: 0xabc...

Check: /factory status
```

---

## 🔐 Segurança

### Autenticação
- ✅ Apenas `TELEGRAM_CHAT_ID` configurado pode usar comandos
- ⏳ [TODO] Adicionar whitelist de usuários
- ⏳ [TODO] Implementar roles (admin, user, readonly)

### Rate Limiting
- ⏳ [TODO] Limitar comandos por usuário
- ⏳ [TODO] Cooldown entre comandos caros (mint, deploy)

### Confirmação
- 🟡 Comandos destrutivos pedem confirmação
- ⏳ [TODO] Implementar confirmação via botões inline

---

## 📈 Roadmap

### v1.1 (Esta Semana)
- [ ] Comandos `/agent` (neo-agent-full status)
- [ ] Notificações push (webhook listener)
- [ ] Inline buttons para confirmação

### v1.2 (Próximas 2 Semanas)
- [ ] Comandos `/ipfs` (upload, fetch)
- [ ] Multi-user whitelist
- [ ] Rate limiting
- [ ] Transaction history export

### v2.0 (Futuro)
- [ ] MiniApp Telegram (Web View)
- [ ] Wallet abstraction (buy tokens in-app)
- [ ] Gamification (XP, levels)
- [ ] Referral system

---

## 🐛 Troubleshooting

### Bot não responde
1. Verificar se `TELEGRAM_BOT_TOKEN` está correto
2. Checar se bot está ativo: `pnpm moltbot telegram start`
3. Ver logs de erro no terminal

### Comandos falham
1. Verificar se skills estão implementadas
2. Checar permissões de execução
3. Ver logs de erro retornados pelo bot

### Timeout em comandos longos
1. Comandos de deploy podem demorar
2. Bot envia mensagem intermediária "⏳ Executing..."
3. Se timeout, verificar logs do skill

---

## 🔗 Links Úteis

- **Telegram Bot API:** https://core.telegram.org/bots/api
- **node-telegram-bot-api:** https://github.com/yagop/node-telegram-bot-api
- **Neobot Skills:** `/Users/nettomello/CODIGOS/neobot/skills/`
- **Notion Command Center:** https://www.notion.so/2f78c6e83be081af880edd88440a4642

---

**Última Atualização:** 29 Janeiro 2026  
**Status:** ✅ Bot funcional, comandos básicos implementados
