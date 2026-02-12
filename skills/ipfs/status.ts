#!/usr/bin/env node
/**
 * @file status.ts
 * @description Check IPFS node status
 * @usage pnpm moltbot ipfs status
 */

import { IPFS_API_URL, IPFS_CONFIG } from './config.js';

interface IPFSIDResponse {
  ID: string;
  PublicKey: string;
  Addresses: string[];
  AgentVersion: string;
  ProtocolVersion: string;
}

interface IPFSStatsResponse {
  NumObjects: number;
  RepoSize: number;
  RepoPath: string;
  Version: string;
  StorageMax: number;
}

async function checkStatus(): Promise<void> {
  console.log('🟢 IPFS Node Status');
  console.log('─'.repeat(40));
  console.log('');

  try {
    // Check ID
    const idResponse = await fetch(`${IPFS_API_URL}/api/v0/id`, {
      method: 'POST',
    });

    if (!idResponse.ok) {
      throw new Error(`IPFS API error: ${idResponse.statusText}`);
    }

    const idData: IPFSIDResponse = await idResponse.json();

    console.log(`📋 Node Info:`);
    console.log(`   Peer ID: ${idData.ID}`);
    console.log(`   Agent: ${idData.AgentVersion}`);
    console.log(`   Protocol: ${idData.ProtocolVersion}`);
    console.log('');

    console.log(`🌐 Addresses (${idData.Addresses.length}):`);
    idData.Addresses.slice(0, 3).forEach((addr) => {
      console.log(`   ${addr}`);
    });
    if (idData.Addresses.length > 3) {
      console.log(`   ... and ${idData.Addresses.length - 3} more`);
    }
    console.log('');

    // Check stats
    const statsResponse = await fetch(`${IPFS_API_URL}/api/v0/repo/stat`, {
      method: 'POST',
    });

    if (statsResponse.ok) {
      const statsData: IPFSStatsResponse = await statsResponse.json();

      console.log(`💾 Storage:`);
      console.log(`   Used: ${(statsData.RepoSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
      console.log(`   Max: ${(statsData.StorageMax / 1024 / 1024 / 1024).toFixed(2)} GB`);
      console.log(`   Objects: ${statsData.NumObjects.toLocaleString()}`);
      console.log(`   Path: ${statsData.RepoPath}`);
      console.log('');
    }

    // Check peers
    const peersResponse = await fetch(`${IPFS_API_URL}/api/v0/swarm/peers`, {
      method: 'POST',
    });

    if (peersResponse.ok) {
      const peersData: { Peers: Array<{ Peer: string }> } = await peersResponse.json();
      console.log(`👥 Peers: ${peersData.Peers.length} connected`);
      console.log('');
    }

    console.log('✅ IPFS node is healthy and running');
    console.log('');
    console.log(`🔗 Gateway: http://${IPFS_CONFIG.gateway.host}:${IPFS_CONFIG.gateway.port}`);
    console.log(`🔗 API: ${IPFS_API_URL}`);
  } catch (error: any) {
    console.error('❌ IPFS node is not responding');
    console.error(`   Error: ${error.message}`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check if IPFS daemon is running: ps aux | grep ipfs');
    console.log('   2. Start daemon: ipfs daemon');
    console.log('   3. Check API endpoint: curl http://127.0.0.1:5001/api/v0/id');
    process.exit(1);
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    console.log(`
Usage: pnpm moltbot ipfs status

Check IPFS node status including:
- Peer ID and addresses
- Storage usage
- Connected peers
- Gateway and API endpoints

Examples:
  pnpm moltbot ipfs status
    `);
    process.exit(0);
  }

  checkStatus().catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { checkStatus };
