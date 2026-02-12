<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
     SMART FACTORY · API REFERENCE
========================================
```

Complete API documentation for Smart Factory
nsf CLI commands (v0.5.3) and Neobot skills.

────────────────────────────────────────

## nsf CLI Commands

### nsf init

Initialize token environment.

**Usage:**

```bash
nsf init
```

**Output:**

```json
{
  "success": true,
  "message": "Token environment initialized",
  "path": "./tokens/"
}
```

────────────────────────────────────────

### nsf token draft

Create token configuration draft.

**Usage:**

```bash
nsf token draft
```

Prompts for:
- Token name
- Token symbol  
- Initial supply
- Network (base/polygon)

**Options:**

- `--name` (required): Token name
- `--symbol` (required): Token symbol (3-5 chars)
- `--supply` (required): Initial supply
- `--network` (optional): base | polygon (default: base)
- `--type` (optional): ERC20 | ERC721 | ERC1155 (default: ERC20)

**Output:**

```json
{
  "success": true,
  "contract": {
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "name": "My Token",
    "symbol": "MTK",
    "supply": "1000000",
    "network": "base",
    "tx_hash": "0xabcdef...",
    "deployer": "0x5678...",
    "gas_used": "123456"
  }
}
```

────────────────────────────────────────

### nxf mint

Mint new tokens.

**Usage:**

```bash
nxf mint \
  --contract 0x1234...5678 \
  --to 0xabcd...ef01 \
  --amount 1000
```

**Options:**

- `--contract` (required): Contract address
- `--to` (required): Recipient address
- `--amount` (required): Amount to mint

**Output:**

```json
{
  "success": true,
  "tx_hash": "0xabcdef1234567890abcdef1234567890abcdef12",
  "to": "0xabcdef0123456789abcdef0123456789abcdef01",
  "amount": "1000",
  "gas_used": "45678"
}
```

────────────────────────────────────────

### nxf burn

Burn tokens.

**Usage:**

```bash
nxf burn \
  --contract 0x1234...5678 \
  --amount 500
```

**Options:**

- `--contract` (required): Contract address
- `--amount` (required): Amount to burn

**Output:**

```json
{
  "success": true,
  "tx_hash": "0x...",
  "amount": "500",
  "gas_used": "34567"
}
```

────────────────────────────────────────

### nxf verify

Verify contract on block explorer.

**Usage:**

```bash
nxf verify \
  --contract 0x1234...5678 \
  --network base
```

**Options:**

- `--contract` (required): Contract address
- `--network` (required): base | polygon

**Output:**

```json
{
  "success": true,
  "explorer_url": "https://basescan.org/address/0x1234...5678#code",
  "verified": true
}
```

────────────────────────────────────────

### nxf status

Check contract status.

**Usage:**

```bash
nxf status --contract 0x1234...5678
```

**Options:**

- `--contract` (required): Contract address

**Output:**

```json
{
  "success": true,
  "contract": {
    "address": "0x1234...5678",
    "name": "My Token",
    "symbol": "MTK",
    "total_supply": "1000000",
    "decimals": 18,
    "owner": "0xabcd...ef01",
    "verified": true,
    "network": "base"
  }
}
```

────────────────────────────────────────

## Neobot Skills

### factory:deploy

Deploy contract via Neobot.

**CLI Usage:**

```bash
moltbot factory:deploy \
  --name "My Token" \
  --symbol MTK \
  --supply 1000000
```

**Skill Response:**

```json
{
  "success": true,
  "contract": "0x1234567890abcdef1234567890abcdef12345678",
  "tx_hash": "0xabcdef...",
  "explorer_url": "https://basescan.org/tx/0xabcdef...",
  "network": "base",
  "gas_used": "123456"
}
```

**Ledger Entry:**

```json
{
  "action": "deploy_contract",
  "actor": "user",
  "channel": "cli",
  "details": {
    "contract": "0x1234...5678",
    "name": "My Token",
    "symbol": "MTK",
    "supply": "1000000",
    "network": "base"
  },
  "timestamp": "2026-01-30T14:30:00.000Z"
}
```

────────────────────────────────────────

### factory:mint

Mint tokens via Neobot.

**CLI Usage:**

```bash
moltbot factory:mint \
  --contract 0x1234...5678 \
  --to 0xabcd...ef01 \
  --amount 1000
```

**Skill Response:**

```json
{
  "success": true,
  "tx_hash": "0xabcdef...",
  "to": "0xabcd...ef01",
  "amount": "1000",
  "explorer_url": "https://basescan.org/tx/0xabcdef..."
}
```

**Ledger Entry:**

```json
{
  "action": "mint_tokens",
  "actor": "user",
  "channel": "cli",
  "details": {
    "contract": "0x1234...5678",
    "to": "0xabcd...ef01",
    "amount": "1000",
    "tx_hash": "0xabcdef..."
  },
  "timestamp": "2026-01-30T14:35:00.000Z"
}
```

────────────────────────────────────────

### factory:verify

Verify contract via Neobot.

**CLI Usage:**

```bash
moltbot factory:verify \
  --contract 0x1234...5678 \
  --network base
```

**Skill Response:**

```json
{
  "success": true,
  "verified": true,
  "explorer_url": "https://basescan.org/address/0x1234...5678#code"
}
```

**Ledger Entry:**

```json
{
  "action": "verify_contract",
  "actor": "user",
  "channel": "cli",
  "details": {
    "contract": "0x1234...5678",
    "network": "base",
    "explorer_url": "https://basescan.org/address/0x1234...5678#code"
  },
  "timestamp": "2026-01-30T14:40:00.000Z"
}
```

────────────────────────────────────────

### factory:status

Check contract status via Neobot.

**CLI Usage:**

```bash
moltbot factory:status \
  --contract 0x1234...5678
```

**Skill Response:**

```json
{
  "success": true,
  "contract": {
    "address": "0x1234...5678",
    "name": "My Token",
    "symbol": "MTK",
    "total_supply": "1000000",
    "decimals": 18,
    "owner": "0xabcd...ef01",
    "verified": true,
    "network": "base"
  }
}
```

**Ledger Entry:**

```json
{
  "action": "query_contract_status",
  "actor": "user",
  "channel": "cli",
  "details": {
    "contract": "0x1234...5678"
  },
  "timestamp": "2026-01-30T14:45:00.000Z"
}
```

────────────────────────────────────────

## Dashboard API (neo-api)

### POST /api/compile

Compile Solidity code.

**Request:**

```json
{
  "code": "pragma solidity ^0.8.0; contract MyToken { ... }",
  "compiler_version": "0.8.20"
}
```

**Response:**

```json
{
  "success": true,
  "bytecode": "0x60806040...",
  "abi": [ ... ],
  "warnings": []
}
```

────────────────────────────────────────

### POST /api/deploy

Deploy compiled contract.

**Request:**

```json
{
  "bytecode": "0x60806040...",
  "abi": [ ... ],
  "network": "base",
  "constructor_args": ["My Token", "MTK", 1000000]
}
```

**Response:**

```json
{
  "success": true,
  "contract": "0x1234...5678",
  "tx_hash": "0xabcdef..."
}
```

────────────────────────────────────────

### GET /api/metadata

Get token metadata.

**Request:**

```bash
GET /api/metadata?contract=0x1234...5678
```

**Response:**

```json
{
  "success": true,
  "metadata": {
    "name": "My Token",
    "symbol": "MTK",
    "decimals": 18,
    "total_supply": "1000000",
    "icon": "https://..."
  }
}
```

────────────────────────────────────────

## Error Codes

```text
▓▓▓ ERROR CODES
────────────────────────────────────────
E001  Invalid contract address
E002  Insufficient gas
E003  Contract not found
E004  Unauthorized (not owner)
E005  Network not supported
E006  Compilation failed
E007  Deploy failed
E008  Verification failed
E009  RPC error
E010  Unknown error
```

────────────────────────────────────────

## Networks

### Base (L2)

```text
▓▓▓ BASE NETWORK
────────────────────────────────────────
Chain ID: 8453
RPC: https://mainnet.base.org
Explorer: https://basescan.org
Currency: ETH
Gas: ~0.001 ETH per tx (cheap!)
```

### Polygon (L2)

```text
▓▓▓ POLYGON NETWORK
────────────────────────────────────────
Chain ID: 137
RPC: https://polygon-rpc.com
Explorer: https://polygonscan.com
Currency: MATIC
Gas: ~0.01 MATIC per tx (cheap!)
```

────────────────────────────────────────

## Rate Limits

```text
▓▓▓ RATE LIMITS
────────────────────────────────────────
nxf CLI: No limit (local)
Dashboard API: 60 req/min per IP
QuickNode RPC: 25 req/sec
Vercel Functions: 125,000/month
```

────────────────────────────────────────

## Testing

### Local Testing

```bash
# Install nxf
npm install -g @neo-smart-factory/cli

# Test deploy (testnet)
nxf deploy \
  --name "Test Token" \
  --symbol TST \
  --supply 1000 \
  --network base-testnet

# Test mint
nxf mint \
  --contract 0x... \
  --to 0x... \
  --amount 100

# Test via Neobot
moltbot factory:deploy --name "Test" --symbol TST --supply 1000
moltbot factory:status --contract 0x...
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Clear API, clear mind."

Documentation is code.
────────────────────────────────────────
