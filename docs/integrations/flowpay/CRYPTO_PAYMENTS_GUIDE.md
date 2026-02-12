# FlowPay - Guia de Pagamentos Cripto (USDC/Token)

**Data:** 2026-01-30  
**Status:** 📚 DOCUMENTAÇÃO TÉCNICA

---

## 🎯 Visão Geral

O FlowPay suporta **2 formas de pagamento:**

1. **PIX (BRL)** → Conversão imediata via Woovi
2. **Cripto (USDC/Tokens)** → Direto na blockchain

Este guia explica como funciona o pagamento em **cripto** e como configurar.

---

## 🔄 Como Funciona o Fluxo Cripto

### Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│               CLIENTE QUER PAGAR                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 v
         ┌───────────────┐
         │  Escolhe:     │
         │  • PIX (BRL)  │
         │  • Cripto     │
         └───────┬───────┘
                 │
                 v
    ┌────────────┴──────────────┐
    │                           │
    v                           v
┌─────────────┐         ┌──────────────┐
│   PIX       │         │   CRIPTO     │
│   (Woovi)   │         │   (Web3)     │
└─────────────┘         └──────────────┘
    │                           │
    v                           v
┌─────────────┐         ┌──────────────┐
│ QR Code PIX │         │ Wallet       │
│ Copia-cola  │         │ Connect      │
└─────────────┘         └──────────────┘
    │                           │
    v                           v
┌─────────────┐         ┌──────────────┐
│ Paga no     │         │ Aprova       │
│ banco       │         │ transação    │
└─────────────┘         └──────────────┘
    │                           │
    v                           v
┌─────────────┐         ┌──────────────┐
│ Woovi       │         │ Blockchain   │
│ confirma    │         │ confirma     │
└─────────────┘         └──────────────┘
    │                           │
    └───────────┬───────────────┘
                v
        ┌───────────────┐
        │  FlowPay      │
        │  confirma     │
        │  pagamento    │
        └───────┬───────┘
                v
        ┌───────────────┐
        │  Libera       │
        │  acesso       │
        └───────────────┘
```

---

## 🔑 Configuração da Wallet (Receber Pagamentos)

### 1. Onde Configurar

A wallet de **recebimento** é configurada no FlowPay em:

```typescript
// /CODIGOS/flowpay/src/config/wallet.ts (ou equivalente)

export const PAYMENT_CONFIG = {
  // Wallet que RECEBE os pagamentos
  recipient_wallet: "0xSUA_WALLET_AQUI",
  
  // Tokens aceitos
  accepted_tokens: [
    {
      symbol: "USDC",
      contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC Ethereum
      decimals: 6,
      network: "ethereum"
    },
    {
      symbol: "USDC",
      contract: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      decimals: 6,
      network: "polygon"
    },
    {
      symbol: "USDT",
      contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT Ethereum
      decimals: 6,
      network: "ethereum"
    }
  ]
};
```

### 2. Formatos de Wallet Suportados

```typescript
// Ethereum Address (padrão EVM)
"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"

// ENS Domain (resolve para address)
"mello.eth"

// Suporta todas as redes EVM:
- Ethereum Mainnet
- Polygon
- Base
- Linea
- Mantle
- opBNB
- Unichain
```

---

## 💰 Como o Pagamento Cripto Acontece

### Passo a Passo (Cliente)

1. **Cliente escolhe pagar com cripto**
   ```
   → Clica em "Pagar com Cripto"
   → Vê opções: USDC, USDT, ETH, etc.
   ```

2. **Conecta wallet (MetaMask/WalletConnect)**
   ```
   → Web3Auth popup
   → Cliente aprova conexão
   → Wallet conectada
   ```

3. **FlowPay gera pedido**
   ```
   Valor: R$ 1.500
   Conversão: 1.500 BRL = ~$300 USD (cotação atual)
   Token: USDC (escolha do cliente)
   Rede: Polygon (gas mais barato)
   
   Contrato: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
   Para: 0xSUA_WALLET (você recebe)
   Quantidade: 300 USDC
   ```

4. **Cliente aprova transação**
   ```
   MetaMask popup:
   "Enviar 300 USDC para 0xSUA_WALLET"
   Gas fee: ~$0.01 (Polygon)
   Total: 300 USDC + gas
   
   → Cliente confirma
   → Transação enviada para blockchain
   ```

5. **Blockchain processa**
   ```
   → Transação entra na mempool
   → Mineradores/validadores confirmam
   → ~30 segundos (Polygon) ou ~15 segundos (Ethereum)
   → Transação confirmada!
   ```

6. **FlowPay detecta pagamento**
   ```
   → QuickNode RPC monitora blockchain
   → Detecta transfer para sua wallet
   → Valida: amount correto + token correto + rede correta
   → Marca pedido como PAID
   → Libera acesso ao cliente
   ```

---

## 🔍 Verificação de Pagamento Cripto

### Como o FlowPay Verifica

```typescript
// Simplified flow
async function verifyPayment(orderId: string) {
  // 1. Pegar dados do pedido
  const order = await getOrder(orderId);
  
  // 2. Conectar no QuickNode (RPC)
  const provider = new ethers.JsonRpcProvider(
    "https://polygon-mainnet.g.alchemy.com/..."
  );
  
  // 3. Buscar transações para sua wallet
  const filter = {
    address: USDC_CONTRACT, // Token USDC
    topics: [
      ethers.id("Transfer(address,address,uint256)"),
      null, // from (any)
      ethers.zeroPadValue(YOUR_WALLET, 32) // to (você)
    ]
  };
  
  const events = await provider.getLogs({
    ...filter,
    fromBlock: order.created_block,
    toBlock: "latest"
  });
  
  // 4. Verificar se existe transfer com valor correto
  for (const event of events) {
    const decoded = decodeTransfer(event);
    
    if (
      decoded.to === YOUR_WALLET &&
      decoded.amount >= order.expected_amount &&
      decoded.txHash === order.expected_tx
    ) {
      // ✅ PAGAMENTO CONFIRMADO!
      return {
        paid: true,
        tx_hash: decoded.txHash,
        confirmations: decoded.confirmations
      };
    }
  }
  
  // ⏳ Ainda não pago
  return { paid: false };
}
```

---

## 🛠️ Configuração Prática

### PASSO 1: Criar/Obter Wallet de Recebimento

```bash
# Opção 1: Usar wallet existente (MetaMask/hardware wallet)
# → Copiar o address: 0x...

# Opção 2: Gerar nova wallet (Node.js)
node -e "
  const ethers = require('ethers');
  const wallet = ethers.Wallet.createRandom();
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('⚠️  GUARDAR PRIVATE KEY EM LUGAR SEGURO!');
"

# Output:
# Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
# Private Key: 0xabc123...
```

### PASSO 2: Configurar no FlowPay

```bash
# No projeto FlowPay
cd /Users/nettomello/CODIGOS/flowpay

# Editar .env
echo "RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0" >> .env
echo "QUICKNODE_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY" >> .env
```

### PASSO 3: Configurar no Railway

```bash
# Railway Dashboard → Variables
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
QUICKNODE_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### PASSO 4: Testar Recebimento

```bash
# 1. Enviar USDC de teste (Polygon testnet)
# → Polygon Mumbai (testnet)
# → Faucet: https://faucet.polygon.technology/
# → Enviar 1 USDC para sua wallet

# 2. Verificar recebimento
curl https://flowpay-production-10d8.up.railway.app/api/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "test-123",
    "network": "polygon",
    "token": "USDC"
  }'

# Output esperado:
{
  "paid": true,
  "tx_hash": "0xabc123...",
  "confirmations": 30,
  "amount_received": "1.000000",
  "token": "USDC"
}
```

---

## 🔐 Segurança da Wallet

### ⚠️ NUNCA expor private key

```bash
# ❌ ERRADO - NUNCA fazer isso:
PRIVATE_KEY=0xabc123... # NO CÓDIGO
PRIVATE_KEY=0xabc123... # NO .env COMMITADO

# ✅ CORRETO:
# Usar apenas o ADDRESS para receber
# Private key guardada em:
# - Hardware wallet (Ledger/Trezor)
# - Keystore encrypted
# - 1Password/Secrets manager
```

### Hot Wallet vs Cold Wallet

```
┌────────────────────────────────────────┐
│           HOT WALLET                   │
│  (Conectada à internet)                │
│                                        │
│  • Recebe pagamentos automáticos      │
│  • Monitora blockchain 24/7           │
│  • Saldo mantido baixo (~$1000)       │
│  • Private key em servidor criptografada │
│                                        │
│  ⚠️  Se hackeada: perda limitada      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│           COLD WALLET                  │
│  (Offline - Hardware wallet)           │
│                                        │
│  • Armazena saldo maior (~$50k+)      │
│  • Nunca conectada à internet         │
│  • Transfers manuais apenas           │
│  • Ledger/Trezor fisicamente guardado │
│                                        │
│  ✅ Segurança máxima                  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│        FLUXO RECOMENDADO               │
│                                        │
│  Cliente paga → Hot Wallet            │
│       ↓                                │
│  Acumula $1000 → Transfer automático  │
│       ↓                                │
│  Cold Wallet (seguro)                 │
└────────────────────────────────────────┘
```

---

## 📊 Comparação: PIX vs Cripto

| Aspecto | PIX (BRL) | Cripto (USDC) |
|---------|-----------|---------------|
| **Confirmação** | ~30 segundos | ~30 segundos |
| **Taxa** | 0% (Woovi free tier) | Gas (~$0.01-0.50) |
| **Reversível** | Sim (fraude) | Não (blockchain) |
| **KYC** | Sim (banco) | Não (self-custody) |
| **Conversão** | Direto BRL | BRL→USD→USDC |
| **Volatilidade** | Não (BRL) | Baixa (USDC stablecoin) |
| **Custódia** | Woovi + Banco | Você (auto-custódia) |
| **Auditoria** | Woovi dashboard | Blockchain explorer |

---

## 🎯 Casos de Uso

### Quando usar PIX:
- ✅ Cliente brasileiro
- ✅ Pagamento em BRL
- ✅ Cliente não tem cripto
- ✅ Quer confirmação via Woovi
- ✅ Precisa de reversibilidade (proteção ao consumidor)

### Quando usar Cripto:
- ✅ Cliente internacional
- ✅ Cliente tem cripto (MetaMask)
- ✅ Quer auto-custódia total
- ✅ Pagamento anônimo (sem KYC)
- ✅ Valor alto (evita limite PIX)
- ✅ Quer prova imutável on-chain

---

## 🔗 Recursos Necessários

### APIs/Services

1. **QuickNode** (RPC provider)
   ```
   → https://quicknode.com
   → Criar conta
   → Criar endpoint Polygon Mainnet
   → Copiar URL: https://polygon-mainnet.g.alchemy.com/v2/...
   ```

2. **Alchemy** (alternativa ao QuickNode)
   ```
   → https://alchemy.com
   → Mesma função, mais features
   → API key grátis até 300M requests/mês
   ```

3. **Web3Auth** (já configurado no FlowPay)
   ```
   → Gerencia login social → wallet
   → Cliente não precisa ter MetaMask
   → Login com Google/Twitter/Email
   ```

4. **CoinGecko API** (conversão BRL→USD)
   ```
   → https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl
   → Cotação em tempo real
   → Grátis (rate limit: 50 req/min)
   ```

---

## 📝 Checklist de Configuração

```
CRYPTO PAYMENTS SETUP:

[ ] Criar/obter wallet address de recebimento
[ ] Adicionar RECIPIENT_WALLET no .env (local)
[ ] Adicionar RECIPIENT_WALLET no Railway Variables
[ ] Criar conta QuickNode/Alchemy
[ ] Adicionar QUICKNODE_RPC_URL no .env
[ ] Adicionar QUICKNODE_RPC_URL no Railway
[ ] Configurar Web3Auth (CLIENT_ID)
[ ] Testar payment flow em testnet (Mumbai)
[ ] Testar payment flow em mainnet (pequeno valor)
[ ] Configurar auto-sweep (hot → cold wallet)
[ ] Documentar process para time
[ ] Criar runbook de troubleshooting
```

---

## 🚀 Próximos Passos

### Implementar no Neobot Agent Tool

```typescript
// src/agents/tools/flowpay-tool.ts

// Adicionar ação: create_crypto_charge
if (action === "create_crypto_charge") {
  return await handleCreateCryptoCharge(params, flowpayUrl);
}

async function handleCreateCryptoCharge(params, flowpayUrl) {
  const amount_brl = readNumberParam(params, "amount", { required: true });
  const token = readStringParam(params, "token") || "USDC";
  const network = readStringParam(params, "network") || "polygon";
  
  // Converter BRL → USD
  const usd_rate = await getUSDRate(); // CoinGecko
  const amount_usd = amount_brl / usd_rate;
  
  // Criar charge cripto
  const response = await fetch(`${flowpayUrl}/api/create-crypto-charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount_usd,
      token,
      network,
      product_id: params.product_id,
      customer_id: params.customer_id
    })
  });
  
  const data = await response.json();
  
  return jsonResult({
    success: true,
    message: `Crypto payment request created: ${amount_usd} ${token}`,
    payment_url: data.payment_url,
    recipient_wallet: data.recipient_wallet,
    expected_amount: data.expected_amount,
    network: network
  });
}
```

---

## 📞 Ação Imediata

### ME ENVIE:

```
📍 Wallet Address para Receber Pagamentos

Format: 0x...
Network: Ethereum / Polygon / Multi-chain

Exemplo:
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0

Vou configurar:
✅ FlowPay Railway
✅ Neobot Integration
✅ Agent Tool
✅ Payment Monitoring
```

---

**Criado por:** NEØ Protocol  
**Maintainer:** NODE NEØ  
**Last Updated:** 2026-01-30

────────────────────────────────────────
▓▓▓ NΞØ MELLØ  
Core Architect · NΞØ Protocol  
neo@neoprotocol.space

"PIX for local. Crypto for global.  
 Both roads lead to revenue."

Self-custody or full integration.
────────────────────────────────────────
