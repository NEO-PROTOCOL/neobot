#!/usr/bin/env node
/**
 * @file bridge.ts
 * @description Bridge tokens cross-chain via NEØ Smart Factory
 * @usage pnpm moltbot factory bridge --from base --to polygon --amount 10000
 */

import { execSync } from 'child_process';
import path from 'path';

interface BridgeOptions {
  from: 'base' | 'polygon' | 'ton';
  to: 'base' | 'polygon' | 'ton';
  amount: string;
  recipient?: string;
  wait?: boolean;
}

const SMART_CORE_PATH = '/Users/nettomello/CODIGOS/neo-smart-token/smart-core';

const BRIDGE_TIMES: Record<string, string> = {
  'base-polygon': '~10-15 min',
  'polygon-base': '~10-15 min',
  'base-ton': '~5-10 min',
  'ton-base': '~5-10 min',
  'polygon-ton': '~15-20 min',
  'ton-polygon': '~15-20 min',
};

async function bridge(options: BridgeOptions): Promise<void> {
  console.log('🌉 NEØ Smart Factory · Bridge');
  console.log('────────────────────────────');

  if (options.from === options.to) {
    throw new Error('❌ Source and destination must be different');
  }

  if (!options.amount || parseFloat(options.amount) <= 0) {
    throw new Error('❌ Invalid amount. Must be > 0');
  }

  const routeKey = \`\${options.from}-\${options.to}\`;
  const estimatedTime = BRIDGE_TIMES[routeKey] || '~15-20 min';

  console.log(\`📋 Bridge Config:\`);
  console.log(\`   From: \${options.from.toUpperCase()}\`);
  console.log(\`   To: \${options.to.toUpperCase()}\`);
  console.log(\`   Amount: \${options.amount} NEOFLW\`);
  console.log(\`   Estimated Time: \${estimatedTime}\`);
  if (options.recipient) {
    console.log(\`   Recipient: \${options.recipient}\`);
  }
  console.log('');

  try {
    execSync(\`test -d \${SMART_CORE_PATH}\`, { stdio: 'ignore' });
  } catch {
    throw new Error(\`❌ Smart Factory not found at: \${SMART_CORE_PATH}\`);
  }

  console.log('⚙️  Checking deployments...');
  try {
    for (const network of [options.from, options.to]) {
      if (network !== 'ton') {
        const cmd = \`cd \${SMART_CORE_PATH} && npx hardhat run scripts/checkDeployment.js --network \${network}\`;
        execSync(cmd, { stdio: 'pipe' });
      }
    }
    console.log('✅ Contracts deployed on both networks');
  } catch (error) {
    throw new Error('❌ Contract not deployed on source or destination network');
  }

  console.log('');
  console.log('🔨 Initiating bridge transaction...');
  
  if (options.from === 'ton' || options.to === 'ton') {
    console.log('🔷 TON Bridge (via Layerzero)');
    console.log('⚠️  TON bridging requires Layerzero OFT integration');
    console.log('');
    console.log('📖 Manual Steps:');
    console.log('   1. Approve tokens on source chain');
    console.log('   2. Call bridge() on Layerzero OFT');
    console.log('   3. Wait for validator confirmation');
    console.log('   4. Tokens appear on destination');
    console.log('');
    console.log('💡 Implement via TON SDK + Layerzero');
    process.exit(0);
  }

  const env = {
    ...process.env,
    BRIDGE_FROM: options.from,
    BRIDGE_TO: options.to,
    BRIDGE_AMOUNT: options.amount,
    BRIDGE_RECIPIENT: options.recipient || '',
  };

  try {
    const command = \`cd \${SMART_CORE_PATH} && npx hardhat run scripts/bridge.js --network \${options.from}\`;
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      env,
    });

    console.log(output);
    console.log('');
    console.log('✅ Bridge transaction submitted!');
    console.log('');
    console.log(\`⏱️  Estimated time: \${estimatedTime}\`);
    console.log('');
    console.log('📊 Track your bridge:');
    console.log(\`   Source (\${options.from}): pnpm moltbot factory status --network \${options.from}\`);
    console.log(\`   Destination (\${options.to}): pnpm moltbot factory status --network \${options.to}\`);
  } catch (error: any) {
    console.error('❌ Bridge failed:', error.message);
    throw error;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options: BridgeOptions = { from: 'base', to: 'polygon', amount: '' };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    switch (arg) {
      case '--from': options.from = next as any; i++; break;
      case '--to': options.to = next as any; i++; break;
      case '--amount': options.amount = next; i++; break;
      case '--recipient': options.recipient = next; i++; break;
      case '--wait': options.wait = true; break;
      case '--help':
        console.log(\`Usage: pnpm moltbot factory bridge --from <network> --to <network> --amount <number>\`);
        process.exit(0);
    }
  }

  if (!options.amount) {
    console.error('❌ Missing --amount');
    process.exit(1);
  }

  bridge(options).catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { bridge, BridgeOptions };
