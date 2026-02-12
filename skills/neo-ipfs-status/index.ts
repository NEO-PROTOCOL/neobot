#!/usr/bin/env node
/**
 * @file neo-ipfs-status - NEO Protocol Skill
 * @description Check IPFS node status (NEO-compliant)
 * @usage pnpm neobot neo-ipfs-status
 */

import { IPFS_API_URL, IPFS_CONFIG, IPFS_GATEWAY_URL } from './config'

interface IPFSIDResponse {
  ID: string
  PublicKey: string
  Addresses: string[]
  AgentVersion: string
  ProtocolVersion: string
}

interface IPFSStatsResponse {
  NumObjects: number
  RepoSize: number
  RepoPath: string
  Version: string
  StorageMax: number
}

interface IPFSPeersResponse {
  Peers: Array<{ Peer: string }>
}

/**
 * Check IPFS node status
 */
export async function checkIPFSStatus(): Promise<{
  healthy: boolean
  node: IPFSIDResponse | null
  stats: IPFSStatsResponse | null
  peers: number
  error?: string
}> {
  try {
    // Check node ID
    const idResponse = await fetch(`${IPFS_API_URL}/api/v0/id`, {
      method: 'POST',
      signal: AbortSignal.timeout(IPFS_CONFIG.timeout)
    })

    if (!idResponse.ok) {
      throw new Error(`IPFS API error: ${idResponse.statusText}`)
    }

    const node: IPFSIDResponse = await idResponse.json()

    // Check storage stats
    let stats: IPFSStatsResponse | null = null
    
    try {
      const statsResponse = await fetch(`${IPFS_API_URL}/api/v0/repo/stat`, {
        method: 'POST',
        signal: AbortSignal.timeout(IPFS_CONFIG.timeout)
      })

      if (statsResponse.ok) {
        stats = await statsResponse.json()
      }
    } catch {
      // Stats não crítico
    }

    // Check peers
    let peersCount = 0
    
    try {
      const peersResponse = await fetch(`${IPFS_API_URL}/api/v0/swarm/peers`, {
        method: 'POST',
        signal: AbortSignal.timeout(IPFS_CONFIG.timeout)
      })

      if (peersResponse.ok) {
        const peersData: IPFSPeersResponse = await peersResponse.json()
        peersCount = peersData.Peers.length
      }
    } catch {
      // Peers não crítico
    }

    return {
      healthy: true,
      node,
      stats,
      peers: peersCount
    }
  } catch (error: any) {
    return {
      healthy: false,
      node: null,
      stats: null,
      peers: 0,
      error: error.message
    }
  }
}

/**
 * Format and display IPFS status
 */
async function displayStatus(): Promise<void> {
  console.log('')
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║         NEO PROTOCOL - IPFS STATUS CHECKER               ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log('')

  const status = await checkIPFSStatus()

  if (!status.healthy) {
    console.log('❌ IPFS node is not responding')
    console.log(`   Error: ${status.error}`)
    console.log('')
    console.log('💡 Troubleshooting:')
    console.log('   1. Check if IPFS daemon is running: ps aux | grep ipfs')
    console.log('   2. Start daemon: ipfs daemon')
    console.log('   3. Check API endpoint: curl http://127.0.0.1:5001/api/v0/id')
    console.log('')
    process.exit(1)
  }

  // Display node info
  console.log('📋 Node Info:')
  console.log(`   Peer ID:  ${status.node!.ID}`)
  console.log(`   Agent:    ${status.node!.AgentVersion}`)
  console.log(`   Protocol: ${status.node!.ProtocolVersion}`)
  console.log('')

  // Display addresses
  console.log(`🌐 Addresses (${status.node!.Addresses.length}):`)
  status.node!.Addresses.slice(0, 3).forEach((addr) => {
    console.log(`   ${addr}`)
  })
  if (status.node!.Addresses.length > 3) {
    console.log(`   ... and ${status.node!.Addresses.length - 3} more`)
  }
  console.log('')

  // Display storage stats
  if (status.stats) {
    const usedGB = (status.stats.RepoSize / 1024 / 1024 / 1024).toFixed(2)
    const maxGB = (status.stats.StorageMax / 1024 / 1024 / 1024).toFixed(2)
    const usagePercent = ((status.stats.RepoSize / status.stats.StorageMax) * 100).toFixed(1)

    console.log('💾 Storage:')
    console.log(`   Used:    ${usedGB} GB / ${maxGB} GB (${usagePercent}%)`)
    console.log(`   Objects: ${status.stats.NumObjects.toLocaleString()}`)
    console.log(`   Path:    ${status.stats.RepoPath}`)
    console.log('')
  }

  // Display peers
  console.log(`👥 Peers: ${status.peers} connected`)
  console.log('')

  // Display endpoints
  console.log('✅ IPFS node is healthy and running')
  console.log('')
  console.log('🔗 Endpoints:')
  console.log(`   Gateway: ${IPFS_GATEWAY_URL}`)
  console.log(`   API:     ${IPFS_API_URL}`)
  console.log('')
}

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)

  if (args.includes('--help')) {
    console.log(`
NEO IPFS Status Checker v1.0.0

Usage: pnpm neobot neo-ipfs-status [options]

Options:
  --help     Show this help message
  --json     Output as JSON

Description:
  Check IPFS node status including:
  - Peer ID and addresses
  - Storage usage and limits
  - Connected peers
  - Gateway and API endpoints

Examples:
  pnpm neobot neo-ipfs-status
  pnpm neobot neo-ipfs-status --json
    `)
    process.exit(0)
  }

  if (args.includes('--json')) {
    checkIPFSStatus()
      .then((status) => {
        console.log(JSON.stringify(status, null, 2))
      })
      .catch((error) => {
        console.error(JSON.stringify({ error: error.message }, null, 2))
        process.exit(1)
      })
  } else {
    displayStatus().catch((error) => {
      console.error('❌ Error:', error.message)
      process.exit(1)
    })
  }
}

export { checkIPFSStatus as default }
