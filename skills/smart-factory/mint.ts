#!/usr/bin/env node
/**
 * @file mint.ts
 * @description Mint tokens from NEØ Smart Factory
 * @usage pnpm moltbot factory mint --token NEOFLW --amount 1000000 --to 0x...
 */

import { execSync } from 'child_process';
import path from 'path';

interface MintOptions {
  token: 'NEOFLW' | 'CUSTOM';
  amount: string; // In tokens (not wei)
  to: string; // Recipient address
  network?: 'base' | 'polygon' | 'ton';
  batch?: boolean; // Mint to multiple addresses
}

const SMART_CORE_PATH = '/Users/nettomello/CODIGOS/neo-smart-token/smart-core';

async function mint(options: MintOptions): Promise<void> {
  console.log('🏭 NEØ Smart Factory · Mint');
  console.log('───────────────────────────');

  // Validation
  if (!options.amount || parseFloat(options.amount) <= 0) {
    throw new Error('❌ Invalid amount. Must be > 0');
  }

  if (!options.to || !options.to.startsWith('0x')) {
    throw new Error('❌ Invalid recipient address');
  }

  const network = options.network || 'base';

  console.log(`📋 Config:`);
  console.log(`   Token: ${options.token}`);
  console.log(`   Amount: ${options.amount}`);
  console.log(`   To: ${options.to}`);
  console.log(`   Network: ${network}`);
  console.log('');

  // Check if smart-core exists
  try {
    execSync(`test -d ${SMART_CORE_PATH}`, { stdio: 'ignore' });
  } catch {
    throw new Error(`❌ Smart Factory not found at: ${SMART_CORE_PATH}`);
  }

  // For TON, use different approach
  if (network === 'ton') {
    console.log('🔷 TON Jetton Mint');
    console.log('⚠️  TON minting requires manual interaction with Jetton Master');
    console.log('');
    console.log('📖 Steps:');
    console.log('   1. Get Jetton Master address from deployment');
    console.log('   2. Call jettonMint() method');
    console.log('   3. Sign with owner wallet');
    console.log('');
    console.log('💡 Use TON SDK or ton-connect UI');
    process.exit(0);
  }

  // EVM Networks (Base, Polygon)
  console.log('⚙️  Preparing mint transaction...');

  // Check if contract is deployed
  let command = `cd ${SMART_CORE_PATH} && npx hardhat run scripts/checkDeployment.js --network ${network}`;
  try {
    execSync(command, { stdio: 'pipe' });
  } catch (error) {
    throw new Error(`❌ Contract not deployed on ${network}`);
  }

  // Mint tokens
  console.log('🔨 Minting tokens...');
  command = `cd ${SMART_CORE_PATH} && npx hardhat run scripts/mint.js --network ${network}`;
  
  // Set environment variables for the script
  const env = {
    ...process.env,
    MINT_TO: options.to,
    MINT_AMOUNT: options.amount,
  };

  try {
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      env,
    });

    console.log(output);
    console.log('');
    console.log('✅ Mint successful!');
    console.log('');
    console.log('📊 Next steps:');
    console.log('   1. Check balance: pnpm moltbot factory status');
    console.log('   2. Add liquidity: pnpm moltbot factory liquidity');
    console.log('   3. Bridge tokens: pnpm moltbot factory bridge');
  } catch (error: any) {
    console.error('❌ Mint failed:', error.message);
    throw error;
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options: MintOptions = {
    token: 'NEOFLW',
    amount: '',
    to: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--token':
        options.token = next as 'NEOFLW' | 'CUSTOM';
        i++;
        break;
      case '--amount':
        options.amount = next;
        i++;
        break;
      case '--to':
        options.to = next;
        i++;
        break;
      case '--network':
        options.network = next as 'base' | 'polygon' | 'ton';
        i++;
        break;
      case '--batch':
        options.batch = true;
        break;
      case '--help':
        console.log(`
Usage: pnpm moltbot factory mint [options]

Options:
  --token <NEOFLW|CUSTOM>  Token to mint (default: NEOFLW)
  --amount <number>        Amount in tokens (e.g., 1000000)
  --to <address>           Recipient address (0x...)
  --network <network>      Network (base, polygon, ton) (default: base)
  --batch                  Batch mint mode
  --help                   Show this help

Examples:
  pnpm moltbot factory mint --token NEOFLW --amount 1000000 --to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
  pnpm moltbot factory mint --amount 500000 --to 0x123... --network polygon
        `);
        process.exit(0);
    }
  }

  // Validate required args
  if (!options.amount || !options.to) {
    console.error('❌ Missing required arguments: --amount and --to');
    console.log('Run with --help for usage');
    process.exit(1);
  }

  // Run mint
  mint(options).catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { mint, MintOptions };
