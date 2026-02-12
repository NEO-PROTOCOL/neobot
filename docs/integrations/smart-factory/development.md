<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
      SMART FACTORY · DEVELOPMENT
========================================
```

How to develop, test, and deploy
Smart Factory (8-repo system).

────────────────────────────────────────

## Prerequisites

```bash
# Required
- Node.js 20+
- pnpm (or npm)
- Git
- Cursor IDE (or any IDE)

# Blockchain
- MetaMask wallet
- Base testnet ETH
- QuickNode RPC account (optional)

# Optional
- Foundry (for forge-core)
- Hardhat (for smart-core)
```

────────────────────────────────────────

## Local Setup

### 1. Install nxf CLI

```bash
# Install globally
npm install -g @neo-smart-factory/cli

# Verify installation
nxf --version
# Should show: 1.2.0 (or latest)

# Help
nxf help
```

### 2. Configure nxf

```bash
# Create config file
nxf init

# Edit ~/.nxf/config.json
{
  "default_network": "base-testnet",
  "rpc_urls": {
    "base": "https://mainnet.base.org",
    "base-testnet": "https://sepolia.base.org",
    "polygon": "https://polygon-rpc.com"
  },
  "private_key": "YOUR_PRIVATE_KEY_HERE"
}
```

**⚠️ Security:**
- Never commit private keys
- Use environment variables
- Consider hardware wallet

────────────────────────────────────────

## Working with 8 Repositories

### Clone Repositories

```bash
# Create workspace
mkdir -p ~/smart-factory
cd ~/smart-factory

# Clone all 8 repos
git clone https://github.com/neo-smart-token-factory/smart-core
git clone https://github.com/neo-smart-token-factory/smart-ui
git clone https://github.com/neo-smart-token-factory/smart-cli
git clone https://github.com/neo-smart-token-factory/smart-ui-mobile
git clone https://github.com/neo-smart-token-factory/smart-ui-landing
git clone https://github.com/neo-smart-token-factory/neo-api
git clone https://github.com/neo-smart-token-factory/forge-core
git clone https://github.com/neo-smart-token-factory/forge-modules
```

### Development Workflow

```text
▓▓▓ DAILY WORKFLOW
────────────────────────────────────────

1. Choose repo to work on
   └─ cd smart-core (for contracts)
   └─ cd smart-ui (for dashboard)
   └─ cd smart-cli (for nxf tool)

2. Create feature branch
   └─ git checkout -b feature/my-feature

3. Make changes

4. Test locally
   └─ pnpm test (if available)

5. Commit
   └─ git commit -m "feat: add feature"

6. Push
   └─ git push origin feature/my-feature

7. Create PR on GitHub

8. Deploy (auto on merge to main)
   └─ Vercel auto-deploys UIs
   └─ npm publish for nxf CLI
```

────────────────────────────────────────

## smart-core Development

### Setup

```bash
cd smart-core
pnpm install
```

### Compile Contracts

```bash
# Compile with Hardhat
npx hardhat compile

# Output: artifacts/
```

### Test Contracts

```bash
# Run tests
npx hardhat test

# Coverage
npx hardhat coverage
```

### Deploy Contract

```bash
# Deploy to Base testnet
npx hardhat run scripts/deploy-token.ts --network base-testnet

# Deploy to Base mainnet
npx hardhat run scripts/deploy-token.ts --network base
```

────────────────────────────────────────

## smart-ui Development

### Setup

```bash
cd smart-ui
pnpm install
```

### Run Dev Server

```bash
pnpm dev
# Opens at: http://localhost:3000
```

### Build for Production

```bash
pnpm build
# Output: .output/
```

### Deploy to Vercel

```bash
# Auto-deploy on push to main
git push origin main

# Or manual deploy
vercel deploy --prod
```

────────────────────────────────────────

## smart-cli Development

### Setup

```bash
cd smart-cli
pnpm install
```

### Build CLI

```bash
pnpm build
# Output: dist/
```

### Test Locally

```bash
# Link globally
pnpm link

# Test command
nxf --version
nxf help
```

### Publish to npm

```bash
# Bump version
npm version patch

# Publish
npm publish

# Users install:
# npm install -g @neo-smart-factory/cli
```

────────────────────────────────────────

## forge-core Development

### Setup

```bash
cd forge-core

# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Compile Contracts

```bash
forge build
```

### Test Contracts

```bash
# Run tests
forge test

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

### Deploy Contract

```bash
forge create \
  --rpc-url $BASE_RPC \
  --private-key $PRIVATE_KEY \
  src/Token.sol:Token \
  --constructor-args "My Token" "MTK" 1000000
```

────────────────────────────────────────

## Testing via Neobot

### Integration Tests

```bash
# From neobot repo
cd /Users/nettomello/CODIGOS/neobot

# Test deploy skill
moltbot factory:deploy \
  --name "Test Token" \
  --symbol TST \
  --supply 1000

# Test mint skill
moltbot factory:mint \
  --contract 0x... \
  --to 0x... \
  --amount 100

# Test verify skill
moltbot factory:verify \
  --contract 0x... \
  --network base

# Test status skill
moltbot factory:status \
  --contract 0x...
```

────────────────────────────────────────

## Debugging

### nxf CLI Debugging

```bash
# Enable debug mode
export DEBUG=nxf:*

# Run command
nxf deploy --name Test --symbol TST --supply 1000

# Logs will be verbose
```

### Contract Debugging

```bash
# Hardhat console
npx hardhat console --network base-testnet

# Interact with contract
const Token = await ethers.getContractFactory("Token");
const token = await Token.attach("0x...");
const balance = await token.balanceOf("0x...");
console.log(balance.toString());
```

### Common Issues

```text
▓▓▓ TROUBLESHOOTING
────────────────────────────────────────

Issue: nxf command not found
  └─ Fix: npm install -g @neo-smart-factory/cli
  └─ Fix: Check PATH

Issue: Gas estimation failed
  └─ Fix: Check RPC URL
  └─ Fix: Ensure sufficient balance
  └─ Fix: Try higher gas limit

Issue: Verification failed
  └─ Fix: Wait 1-2 minutes after deploy
  └─ Fix: Check contract address
  └─ Fix: Ensure code matches

Issue: Vercel build fails
  └─ Fix: Check build logs
  └─ Fix: Verify package.json scripts
  └─ Fix: Check Node version (20+)
```

────────────────────────────────────────

## Code Style

### Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

### TypeScript

```typescript
// Use strict mode
"use strict";

// ESLint + Prettier
// Follow Airbnb style guide
```

────────────────────────────────────────

## Git Workflow

### Branch Strategy

```text
main         Production branch
  └─ develop   Development branch
      └─ feature/  Feature branches
      └─ fix/      Bug fixes
```

### Commit Convention

```bash
# Use Conventional Commits
feat: Add ERC721 support
fix: Resolve gas estimation issue
docs: Update API reference
chore: Update dependencies
test: Add contract tests
```

────────────────────────────────────────

## Performance

### Optimization

```bash
# Solidity optimization
# hardhat.config.ts
settings: {
  optimizer: {
    enabled: true,
    runs: 200
  }
}

# Foundry optimization
# foundry.toml
[profile.default]
optimizer = true
optimizer_runs = 200
```

### Gas Optimization

```text
▓▓▓ GAS TARGETS
────────────────────────────────────────
ERC20 deploy: < 1,000,000 gas
ERC20 transfer: < 50,000 gas
ERC721 mint: < 100,000 gas
```

────────────────────────────────────────

## Security

### Best Practices

```text
▓▓▓ SECURITY CHECKLIST
────────────────────────────────────────
✅ Use OpenZeppelin contracts
✅ Reentrancy guards
✅ Access control
✅ Pausable contracts
✅ Test coverage > 90%
✅ Gas limit checks
✅ Input validation
✅ No private keys in code
```

────────────────────────────────────────

## References

- Hardhat Docs: https://hardhat.org
- Foundry Docs: https://book.getfoundry.sh
- OpenZeppelin: https://docs.openzeppelin.com
- Vercel: https://vercel.com/docs

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code, test, deploy, repeat."

Development is evolution.
────────────────────────────────────────
