/**
 * Smart Factory Status Skill
 * Check factory progress and health via nsf CLI
 * 
 * Wraps: nsf status
 */

import { execSync } from 'child_process';

export const metadata = {
  name: 'factory:status',
  description: 'Check Smart Factory progress and status',
  category: 'smart-factory',
  tags: ['factory', 'status', 'health', 'progress'],
  version: '2.0.0',
  author: 'NEØ Protocol',
  priority: 'high'
};

interface StatusOutput {
  success: boolean;
  factory_status?: 'healthy' | 'warning' | 'critical';
  deployments?: {
    network: string;
    contract_address?: string;
    status: 'deployed' | 'pending' | 'not_deployed';
  }[];
  tokens_drafted?: number;
  tokens_deployed?: number;
  last_activity?: string;
  report?: string;
  error?: string;
}

export async function execute(ctx: any): Promise<StatusOutput> {
  try {
    console.log('[factory:status] Checking Smart Factory status...');

    // Check if nsf CLI is installed
    try {
      execSync('which nsf', { stdio: 'pipe' });
    } catch {
      return {
        success: false,
        error: 'nsf CLI not installed. Install: git clone + npm link'
      };
    }

    // Execute nsf status
    const output = execSync('nsf status', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    console.log('[factory:status] nsf output:', output);

    // Parse status output
    const result = parseStatusOutput(output);

    // Store in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'smart-factory',
        action: 'status_checked',
        data: {
          factory_status: result.factory_status,
          tokens_deployed: result.tokens_deployed,
          timestamp: new Date().toISOString()
        }
      });
    }

    return {
      success: true,
      ...result
    };

  } catch (error: any) {
    console.error('[factory:status] Error:', error);
    return {
      success: false,
      factory_status: 'critical',
      error: error.message || 'Failed to check status'
    };
  }
}

/**
 * Parse nsf status output
 */
function parseStatusOutput(output: string): {
  factory_status: 'healthy' | 'warning' | 'critical';
  deployments: any[];
  tokens_drafted: number;
  tokens_deployed: number;
  last_activity: string;
  report: string;
} {
  const lines = output.split('\n');
  
  // Extract metrics
  const draftedMatch = output.match(/drafted[:\s]+(\d+)/i);
  const deployedMatch = output.match(/deployed[:\s]+(\d+)/i);
  
  // Extract deployments (lines with network + address)
  const deployments = lines
    .filter(line => line.match(/0x[a-fA-F0-9]{40}/))
    .map(line => {
      const addressMatch = line.match(/0x[a-fA-F0-9]{40}/);
      const networkMatch = line.match(/(base|polygon|ton)/i);
      
      return {
        network: networkMatch ? networkMatch[0].toLowerCase() : 'unknown',
        contract_address: addressMatch ? addressMatch[0] : undefined,
        status: 'deployed' as const
      };
    });

  // Determine health status
  let factory_status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (output.toLowerCase().includes('critical') || output.includes('❌')) {
    factory_status = 'critical';
  } else if (output.toLowerCase().includes('warning') || output.includes('⚠️')) {
    factory_status = 'warning';
  }

  return {
    factory_status,
    deployments,
    tokens_drafted: draftedMatch ? parseInt(draftedMatch[1]) : 0,
    tokens_deployed: deployedMatch ? parseInt(deployedMatch[1]) : 0,
    last_activity: new Date().toISOString(),
    report: output
  };
}

/**
 * Usage:
 * 
 * ```bash
 * moltbot factory:status
 * ```
 * 
 * Returns:
 * - Factory health status
 * - Number of tokens drafted
 * - Number of tokens deployed
 * - Deployment details (network + addresses)
 * - Full status report
 */
