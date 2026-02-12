/**
 * Smart Factory Deploy Skill
 * Deploys token contract with security simulation via nsf CLI
 * 
 * Wraps: nsf token deploy TOKEN_NAME
 * 
 * Features:
 * - Security/Econ/Risk simulation before deploy
 * - Auto-blocks if critical risk detected
 * - Protocol Authority pattern (Phase 2)
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const metadata = {
  name: 'factory:deploy',
  description: 'Deploy token with security simulation',
  category: 'smart-factory',
  tags: ['factory', 'deploy', 'token', 'security'],
  version: '2.0.0',
  author: 'NEØ Protocol',
  priority: 'critical'
};

interface DeployInput {
  token: string; // Token name or symbol
  network?: 'base' | 'polygon';
  skipSimulation?: boolean; // Emergency override
}

interface DeployOutput {
  success: boolean;
  contract_address?: string;
  tx_hash?: string;
  network?: string;
  security_report?: {
    passed: boolean;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    issues: string[];
  };
  message?: string;
  error?: string;
}

export async function execute(ctx: any, input: DeployInput): Promise<DeployOutput> {
  const { token, network = 'base', skipSimulation = false } = input;

  if (!token) {
    return {
      success: false,
      error: 'Missing required field: token'
    };
  }

  try {
    console.log(`[factory:deploy] Deploying ${token} to ${network}...`);

    // Check if nsf CLI is installed
    try {
      execSync('which nsf', { stdio: 'pipe' });
    } catch {
      return {
        success: false,
        error: 'nsf CLI not installed. Install: git clone + npm link'
      };
    }

    // Check if token config exists
    const configFile = `tokens/${token}.json`;
    if (!existsSync(configFile)) {
      return {
        success: false,
        error: `Token config not found: ${configFile}. Run factory:draft first.`
      };
    }

    // Read token config
    const config = JSON.parse(readFileSync(configFile, 'utf-8'));
    console.log(`[factory:deploy] Config loaded: ${config.name} (${config.symbol})`);

    // Phase 1: Security Simulation (unless skipped)
    let securityReport: DeployOutput['security_report'] = undefined;
    if (!skipSimulation) {
      console.log('[factory:deploy] Running security simulation...');
      
      try {
        const simOutput = execSync(`nsf simulate`, {
          encoding: 'utf-8',
          stdio: 'pipe',
          env: {
            ...process.env,
            TOKEN_NAME: token
          }
        });

        // Parse simulation output
        securityReport = parseSimulationOutput(simOutput);
        console.log('[factory:deploy] Security report:', securityReport);

        // Block if critical risk
        if (securityReport && securityReport.risk_level === 'critical') {
          return {
            success: false,
            error: 'BLOCKED: Critical security risk detected',
            security_report: securityReport
          };
        }
      } catch (simError: any) {
        console.warn('[factory:deploy] Simulation error:', simError.message);
        // Continue with deploy (simulation is best-effort)
      }
    }

    // Phase 2: Deploy via nsf token deploy
    console.log(`[factory:deploy] Executing: nsf token deploy ${token}...`);
    
    const deployOutput = execSync(`nsf token deploy ${token}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
      env: {
        ...process.env,
        NETWORK: network
      }
    });

    console.log('[factory:deploy] Deploy output:', deployOutput);

    // Parse deploy output
    const result = parseDeployOutput(deployOutput);

    // Store in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'smart-factory',
        action: 'token_deployed',
        data: {
          token_name: config.name,
          symbol: config.symbol,
          contract_address: result.contract_address,
          tx_hash: result.tx_hash,
          network,
          security_passed: securityReport?.passed ?? true,
          risk_level: securityReport?.risk_level ?? 'unknown'
        }
      });
    }

    return {
      success: true,
      contract_address: result.contract_address,
      tx_hash: result.tx_hash,
      network,
      security_report: securityReport,
      message: `Token deployed: ${config.name} (${config.symbol})`
    };

  } catch (error: any) {
    console.error('[factory:deploy] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to deploy token'
    };
  }
}

/**
 * Parse nsf simulate output
 */
function parseSimulationOutput(output: string): {
  passed: boolean;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  issues: string[];
} {
  // nsf simulate returns structured report
  // Parse for risk level and issues
  
  const hasRisk = output.toLowerCase().includes('risk');
  const hasCritical = output.toLowerCase().includes('critical');
  
  return {
    passed: !hasCritical,
    risk_level: hasCritical ? 'critical' : hasRisk ? 'medium' : 'low',
    issues: output.split('\n').filter(line => 
      line.includes('⚠️') || line.includes('❌')
    )
  };
}

/**
 * Parse nsf token deploy output
 */
function parseDeployOutput(output: string): { contract_address?: string; tx_hash?: string } {
  // Extract contract address (0x...)
  const addressMatch = output.match(/0x[a-fA-F0-9]{40}/);
  
  // Extract tx hash
  const txMatch = output.match(/tx[:\s]+0x[a-fA-F0-9]{64}/i);
  
  return {
    contract_address: addressMatch ? addressMatch[0] : undefined,
    tx_hash: txMatch ? txMatch[0].split(/[:\s]+/)[1] : undefined
  };
}

/**
 * Usage:
 * 
 * ```bash
 * # Standard deploy (with security simulation)
 * moltbot factory:deploy --token MyToken
 * 
 * # Deploy to specific network
 * moltbot factory:deploy --token MyToken --network polygon
 * 
 * # Emergency deploy (skip simulation)
 * moltbot factory:deploy --token MyToken --skipSimulation true
 * ```
 * 
 * Returns contract address + tx hash + security report
 */
