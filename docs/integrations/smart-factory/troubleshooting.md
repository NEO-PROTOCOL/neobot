<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
     SMART FACTORY · TROUBLESHOOTING
========================================
```

Debug guide for common Smart Factory issues.

────────────────────────────────────────

## Quick Diagnosis

```bash
# Check nxf CLI
nxf --version

# Test deploy (testnet)
nxf deploy \
  --name "Test" \
  --symbol TST \
  --supply 1000 \
  --network base-testnet

# Check dashboard
./scripts/smart-factory/check-dashboard.sh

# Test via Neobot
moltbot factory:status --contract 0x...
```

────────────────────────────────────────

## Common Issues

### 1. nxf Command Not Found

**Symptoms:**

```text
bash: nxf: command not found
```

**Causes:**

- nxf CLI not installed
- Not in PATH
- Wrong npm global dir

**Solutions:**

```bash
# Install nxf
npm install -g @neo-smart-factory/cli

# Verify installation
nxf --version

# Check npm global bin
npm config get prefix

# Should be in PATH
echo $PATH

# Add to PATH if needed (add to ~/.zshrc)
export PATH="$PATH:$(npm config get prefix)/bin"

# Reload shell
source ~/.zshrc
```

────────────────────────────────────────

### 2. Deploy Fails (Gas Estimation)

**Symptoms:**

```text
Error: Gas estimation failed
Cannot estimate gas
```

**Causes:**

- Insufficient ETH balance
- RPC error
- Contract compilation issue
- Wrong network

**Solutions:**

```bash
# Check balance
nxf balance

# Should have > 0.001 ETH on testnet
# Get testnet ETH from faucet:
# https://www.alchemy.com/faucets/base-sepolia

# Check RPC
curl -X POST $BASE_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Should return latest block

# Try with higher gas limit
nxf deploy \
  --name "Test" \
  --symbol TST \
  --supply 1000 \
  --gas-limit 2000000

# Check network
nxf config
# Ensure correct network selected
```

────────────────────────────────────────

### 3. Contract Verification Fails

**Symptoms:**

```text
Error: Verification failed
Contract not verified on explorer
```

**Causes:**

- Too soon after deploy (< 1 min)
- Wrong contract address
- Compiler version mismatch
- Constructor args mismatch

**Solutions:**

```bash
# Wait 1-2 minutes after deploy
sleep 120

# Retry verification
nxf verify \
  --contract 0x1234...5678 \
  --network base

# Check contract on explorer
open "https://basescan.org/address/0x1234...5678"

# Manual verification (if auto fails)
# Go to BaseScan → Verify & Publish
# Upload contract source + constructor args

# Check compiler version
# Must match hardhat.config.ts or foundry.toml
```

────────────────────────────────────────

### 4. Mint Fails (Not Owner)

**Symptoms:**

```text
Error: Ownable: caller is not the owner
Unauthorized
```

**Causes:**

- Calling from wrong wallet
- Contract has different owner
- Access control misconfigured

**Solutions:**

```bash
# Check contract owner
nxf status --contract 0x1234...5678
# Look for "owner" field

# Check current wallet
nxf whoami

# If different, use owner wallet
nxf config --private-key $OWNER_PRIVATE_KEY

# Or transfer ownership
nxf transfer-ownership \
  --contract 0x1234...5678 \
  --to 0xNEW_OWNER
```

────────────────────────────────────────

### 5. Dashboard Not Loading

**Symptoms:**

```text
ERR_CONNECTION_REFUSED
404 Not Found
Vercel deployment failed
```

**Causes:**

- Vercel deployment failed
- Build error
- Environment variables missing
- Network issue

**Solutions:**

```bash
# Check Vercel status
curl -I https://smart-ui-delta.vercel.app

# Should return 200 OK

# Check Vercel dashboard
open "https://vercel.com/neo-smart-factory/smart-ui"

# View build logs
# Dashboard → Deployments → Latest → View Log

# Redeploy
# Dashboard → Deployments → Redeploy

# Check environment variables
# Dashboard → Settings → Environment Variables
# Must have:
# - QUICKNODE_RPC_URL
# - WEB3AUTH_CLIENT_ID
# - NEXT_PUBLIC_*

# Test locally
cd smart-ui
pnpm dev
# Should open at http://localhost:3000
```

────────────────────────────────────────

### 6. Neobot Skills Not Working

**Symptoms:**

```text
moltbot factory:deploy
Error: Skill not found
```

**Causes:**

- Skills not created yet
- Neobot not recognizing skills
- integration.json missing

**Solutions:**

```bash
# Check skills directory
ls /Users/nettomello/CODIGOS/neobot/skills/smart-factory/

# Should show:
# - deploy.ts
# - mint.ts
# - verify.ts
# - status.ts

# Check integration.json
cat extensions/smart-factory/integration.json

# Rebuild Neobot
cd /Users/nettomello/CODIGOS/neobot
pnpm build

# List available skills
moltbot skills:list | grep factory

# Test skill directly
node dist/skills/smart-factory/deploy.js
```

────────────────────────────────────────

### 7. RPC Rate Limit Exceeded

**Symptoms:**

```text
Error: Too many requests
429 Rate limit exceeded
```

**Causes:**

- Public RPC overloaded
- QuickNode quota exceeded
- Too many concurrent requests

**Solutions:**

```bash
# Use QuickNode RPC (paid, higher limits)
# Sign up: https://quicknode.com

# Update nxf config
nxf config \
  --rpc-url "https://YOUR-QUICKNODE-ENDPOINT.base.quiknode.pro"

# Or use alternative RPC
# Base: https://mainnet.base.org
# Polygon: https://polygon-rpc.com

# Implement backoff
# Add delay between requests
```

────────────────────────────────────────

### 8. Ledger Not Recording

**Symptoms:**

```text
Skills work
But no entries in Ledger
```

**Causes:**

- Ledger service not initialized
- Permissions issue
- Path incorrect

**Solutions:**

```bash
# Check Ledger location
ls /Users/nettomello/CODIGOS/neobot/data/ledger/

# Should show .jsonl files

# Check permissions
chmod +w data/ledger/

# Test manual entry
moltbot ledger:record \
  --action "test_factory" \
  --actor "user" \
  --channel "cli"

# Check if entry recorded
tail data/ledger/*.jsonl
```

────────────────────────────────────────

### 9. Compilation Fails

**Symptoms:**

```text
Error: Compilation failed
Solidity syntax error
```

**Causes:**

- Syntax error in contract
- Wrong Solidity version
- Missing dependencies
- Import path incorrect

**Solutions:**

```bash
# Check Solidity version
# hardhat.config.ts
solidity: "0.8.20"

# Matches contract?
pragma solidity ^0.8.20;

# Install dependencies
cd smart-core
pnpm install

# Clean and recompile
npx hardhat clean
npx hardhat compile

# Check import paths
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

# Ensure @openzeppelin installed
pnpm add @openzeppelin/contracts
```

────────────────────────────────────────

### 10. Vercel Build Fails

**Symptoms:**

```text
Build failed
Error during build
```

**Causes:**

- Missing environment variables
- Node version mismatch
- Build command incorrect
- Dependency issue

**Solutions:**

```bash
# Check Vercel build logs
# Dashboard → Deployments → Failed deploy → View log

# Verify environment variables
# Dashboard → Settings → Environment Variables

# Check Node version
# vercel.json or package.json
{
  "engines": {
    "node": "20.x"
  }
}

# Clear cache
# Dashboard → Settings → Clear cache → Redeploy

# Test build locally
cd smart-ui
pnpm install
pnpm build

# Should complete without errors
```

────────────────────────────────────────

## Debug Tools

### Health Checks

```bash
# nxf CLI
nxf --version

# Dashboards
curl -I https://smart-ui-delta.vercel.app
curl -I https://landing-jet-seven.vercel.app
curl -I https://nuxt-app-vert.vercel.app

# RPC
curl -X POST $BASE_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Contract Inspection

```bash
# Check contract on explorer
open "https://basescan.org/address/0x..."

# Read contract (via nxf)
nxf read \
  --contract 0x... \
  --method totalSupply

# Call contract (write)
nxf call \
  --contract 0x... \
  --method mint \
  --args '["0x...", 1000]'
```

────────────────────────────────────────

## Emergency Procedures

### Contract Compromised

```text
1. Pause contract (if Pausable)
   └─ nxf pause --contract 0x...

2. Transfer ownership to safe wallet
   └─ nxf transfer-ownership \
        --contract 0x... \
        --to 0xSAFE_WALLET

3. Notify users
   └─ Post on dashboard
   └─ Social media announcement

4. Deploy new contract (if needed)
   └─ nxf deploy ...
```

### Dashboard Down

```text
1. Check Vercel status
   └─ https://www.vercel-status.com

2. Check deployment logs
   └─ Vercel dashboard

3. Rollback deploy
   └─ Redeploy previous version

4. Contact Vercel support
   └─ support@vercel.com
```

────────────────────────────────────────

## Getting Help

```text
▓▓▓ SUPPORT CHANNELS
────────────────────────────────────────

1. Documentation
   └─ docs/integrations/smart-factory/

2. GitHub Issues
   └─ https://github.com/neo-smart-token-factory/smart-core/issues

3. Discord/Slack
   └─ #smart-factory channel

4. Email NODE NEØ
   └─ neo@neoprotocol.space

5. Vercel Support
   └─ https://vercel.com/support
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Every bug teaches. Every fix scales."

Debug > Despair. Always.
────────────────────────────────────────
