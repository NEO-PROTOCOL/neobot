# FlowPay - Guia de Variáveis de Ambiente

Guia completo sobre todas as variáveis de ambiente necessárias para o FlowPay funcionar corretamente.

## ⚠️ Problema de Nomeação

Existe uma **inconsistência histórica** na nomenclatura:

- **Documentação antiga**: usa `WOOVI_*`
- **Código atual**: usa `FLOWPAY_*`
- **Código legado**: usa `OPENPIX_API_KEY`

**Solução**: Manter TODAS as variantes para compatibilidade total.

---

## 📋 Variáveis Obrigatórias

### 1. API do FlowPay (Railway)

```bash
# URL do serviço FlowPay no Railway
FLOWPAY_API_URL=https://flowpay-production-10d8.up.railway.app
```

**Usado por**:

- `src/agents/tools/flowpay-tool.ts`
- `skills/flowpay/buy.ts`
- `skills/flowpay/status.ts`

**Fallback**: Se não configurado, usa a URL do Railway por padrão.

---

### 2. Chave da API Woovi/OpenPix

```bash
# Chave de autenticação da Woovi
FLOWPAY_API_KEY=Q2xpZW50X0.....==
OPENPIX_API_KEY=Q2xpZW50X0.....==  # Legacy fallback
WOOVI_API_KEY=Q2xpZW50X0lk....==    # Documentação

# Use a MESMA chave para todos (compatibilidade)
```

**Usado por**:

- `skills/flowpay/status.ts` (verifica `FLOWPAY_API_KEY` ou `OPENPIX_API_KEY`)
- FlowPay Railway service (usa `WOOVI_API_KEY`)

**Onde obter**:

1. Login em https://app.woovi.com
2. API → Production Keys
3. Copiar Client ID + Secret (formato Base64)

---

### 3. Segredos de Assinatura

#### a) JWT Secret

```bash
# Secret para assinar JWT tokens de desbloqueio
TOKEN_SECRET=your_random_secret_min_64_chars_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

```

**Usado por**:

- `skills/flowpay/unlock.ts` (gera tokens de acesso)
- FlowPay service (valida tokens)

**Importante**: 
- ✅ Deve ser uma string aleatória longa (32+ chars)
- ✅ Deve ser a MESMA no Neobot e no FlowPay Railway
- ❌ NUNCA commitar no git

#### b) Signature Secret

```bash
# Secret para validar webhooks Woovi
FLOWPAY_SIGNATURE_SECRET=openpix_...
WOOVI_WEBHOOK_SECRET=openpix_...  # Same value

# Use o MESMO valor para ambos
```

**Usado por**:
- `skills/flowpay/unlock.ts` (valida webhooks)
- FlowPay webhook handlers

**Onde obter**:
1. Dashboard Woovi → Webhooks
2. Webhook Secret (formato: `openpix_...`)

---

## 🔐 Variáveis Opcionais (Cripto)

### 4. Wallet de Recebimento

```bash
# Wallet Ethereum/Polygon para receber USDC
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
```

**Usado por**:
- FlowPay crypto payment flow
- Smart contract interactions

**Importante**:
- ✅ Apenas o ADDRESS (não a private key!)
- ✅ Pode ser MetaMask, Ledger, etc
- ❌ NUNCA colocar private key aqui

---

### 5. RPC Endpoint (Blockchain)

```bash
# QuickNode, Alchemy, ou Infura
QUICKNODE_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

**Usado por**:
- Verificar transações blockchain
- Confirmar pagamentos USDC

**Onde obter**:
1. QuickNode: https://quicknode.com
2. Alchemy: https://alchemy.com
3. Infura: https://infura.io

---

### 6. Web3Auth (Wallet Connect)

```bash
# Client ID do Web3Auth
WEB3AUTH_CLIENT_ID=BPr...
```

**Usado por**:
- FlowPay frontend (login com wallet)
- Connect wallet flow

**Onde obter**:
1. Dashboard Web3Auth: https://dashboard.web3auth.io
2. Create new project
3. Copy Client ID

---

## ✅ Configuração Completa Recomendada

### Para `.env` Local (Neobot)

```bash
# ============================================
# FLOWPAY CONFIGURATION
# ============================================

# FlowPay API (Railway)
FLOWPAY_API_URL=https://flowpay-production-10d8.up.railway.app

# Woovi/OpenPix Keys (use mesma chave)
FLOWPAY_API_KEY=Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==
OPENPIX_API_KEY=Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==
WOOVI_API_KEY=Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==

# Secrets (use mesmo valor)
FLOWPAY_JWT_SECRET=neo-protocol-secret-change-me-production
FLOWPAY_SIGNATURE_SECRET=openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WOOVI_WEBHOOK_SECRET=openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WOOVI_API_URL=https://api.woovi.com

# Cripto (Opcional - apenas se usar pagamentos em USDC/Token)
# RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
# QUICKNODE_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
# WEB3AUTH_CLIENT_ID=BPr...
```

---

### Para Railway Environment Variables (FlowPay Service)

```bash
# No Railway Dashboard → FlowPay → Variables

WOOVI_API_KEY=Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==
WOOVI_WEBHOOK_SECRET=openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
JWT_SECRET=neo-protocol-secret-change-me-production

# Se usar cripto:
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
QUICKNODE_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
WEB3AUTH_CLIENT_ID=BPr...
```

---

## 🧪 Como Testar

### 1. Verificar Variáveis Locais

```bash
# No terminal do Neobot
cd /Users/nettomello/CODIGOS/neobot

# Verificar se estão definidas
echo "FLOWPAY_API_URL: $FLOWPAY_API_URL"
echo "FLOWPAY_API_KEY: ${FLOWPAY_API_KEY:0:20}..." # Mostra apenas início
echo "FLOWPAY_JWT_SECRET: ${FLOWPAY_JWT_SECRET:0:10}..."
```

### 2. Testar Tool no Agente

```bash
# Rebuild
pnpm build

# Testar via skill
pnpm moltbot skill flowpay/buy \
  --amount 10.00 \
  --product "test-product" \
  --customer "test-user"
```

### 3. Testar API FlowPay (Railway)

```bash
# Testar endpoint de health
curl https://flowpay-production-10d8.up.railway.app/health

# Testar criação de cobrança PIX
curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x0000000000000000000000000000000000000000",
    "valor": 10.00,
    "moeda": "BRL",
    "id_transacao": "test-123",
    "product_id": "test-product"
  }'
```

---

## 🐛 Troubleshooting

### Erro: "FLOWPAY_API_KEY not configured"

**Causa**: Variável não está definida

**Solução**:
```bash
# Adicione no .env
FLOWPAY_API_KEY=<sua-chave-woovi>

# Ou use o fallback legacy
OPENPIX_API_KEY=<sua-chave-woovi>
```

### Erro: "JWT token invalid"

**Causa**: `FLOWPAY_JWT_SECRET` diferente entre Neobot e FlowPay

**Solução**:
1. Escolha um secret único
2. Configure IGUAL no Neobot `.env` e Railway Variables
3. Restart ambos os serviços

### Erro: "Webhook signature mismatch"

**Causa**: `FLOWPAY_SIGNATURE_SECRET` incorreto

**Solução**:
1. Vá no Dashboard Woovi → Webhooks
2. Copie o Webhook Secret (formato: `openpix_...`)
3. Configure em:
   - `.env`: `FLOWPAY_SIGNATURE_SECRET`
   - `.env`: `WOOVI_WEBHOOK_SECRET`
   - Railway: `WOOVI_WEBHOOK_SECRET`

### Erro: "Failed to connect to FlowPay"

**Causa**: `FLOWPAY_API_URL` incorreta ou service down

**Solução**:
```bash
# Verificar se Railway está up
curl https://flowpay-production-10d8.up.railway.app/health

# Se down, verificar Railway dashboard
```

---

## 📊 Checklist de Configuração

### Mínimo para PIX (Produção)

- [x] `FLOWPAY_API_URL` configurado
- [x] `FLOWPAY_API_KEY` (ou `WOOVI_API_KEY`) configurado
- [x] `FLOWPAY_JWT_SECRET` configurado (mesmo no Railway)
- [x] `FLOWPAY_SIGNATURE_SECRET` (ou `WOOVI_WEBHOOK_SECRET`) configurado
- [ ] Railway Variables configuradas
- [ ] Tested E2E

### Completo com Cripto

- [x] Todas as variáveis PIX acima
- [ ] `RECIPIENT_WALLET` configurado
- [ ] `QUICKNODE_RPC_URL` configurado
- [ ] `WEB3AUTH_CLIENT_ID` configurado
- [ ] Wallet tem saldo para gas fees
- [ ] Tested transação blockchain

---

## 🔐 Segurança

### ✅ Boas Práticas

- ✅ `.env` tem permissões 600
- ✅ `.env` está no `.gitignore`
- ✅ Secrets são aleatórios e longos (32+ chars)
- ✅ Production keys diferentes de development
- ✅ API keys rotacionadas periodicamente

### ❌ NUNCA Faça

- ❌ Commitar `.env` no git
- ❌ Usar mesmas keys em dev e prod
- ❌ Colocar private keys em `.env`
- ❌ Compartilhar secrets por email/chat
- ❌ Usar secrets fracos ("password123")

---

## 📚 Referências

- [Woovi Dashboard](https://app.woovi.com)
- [FlowPay Railway](https://railway.app/project/flowpay-production-10d8)
- [QuickNode](https://quicknode.com)
- [Web3Auth](https://dashboard.web3auth.io)
- [Documentação FlowPay](./README.md)

---

**Última atualização**: 30 Jan 2026  
**Status**: ✅ Configuração Completa
