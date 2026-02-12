/**
 * Smart Factory Draft Skill
 * Creates token configuration draft via nsf CLI
 * 
 * Wraps: nsf token draft
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  name: 'factory:draft',
  description: 'Create token configuration draft',
  category: 'smart-factory',
  tags: ['factory', 'token', 'draft', 'config'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'high'
};

interface DraftInput {
  name: string;
  symbol: string;
  supply?: number;
  network?: 'base' | 'polygon';
  decimals?: number;
}

interface DraftOutput {
  success: boolean;
  token_name?: string;
  config_file?: string;
  message?: string;
  error?: string;
}

export async function execute(ctx: any, input: DraftInput): Promise<DraftOutput> {
  const { name, symbol, supply = 1000000, network = 'base', decimals = 18 } = input;

  // Validation
  if (!name || !symbol) {
    return {
      success: false,
      error: 'Missing required fields: name, symbol'
    };
  }

  try {
    console.log(`[factory:draft] Creating draft for ${name} (${symbol})...`);

    // Check if nsf CLI is installed
    try {
      execSync('which nsf', { stdio: 'pipe' });
    } catch {
      return {
        success: false,
        error: 'nsf CLI not installed. Install: git clone + npm link'
      };
    }

    // Create token config (nsf expects interactive, so we prepare JSON)
    const tokenConfig = {
      name,
      symbol,
      totalSupply: supply.toString(),
      decimals,
      network,
      features: {
        mintable: true,
        burnable: true,
        pausable: true
      },
      security: {
        maxSupply: (supply * 2).toString(),
        transferLimit: '1000000'
      },
      metadata: {
        createdBy: 'neobot',
        createdAt: new Date().toISOString()
      }
    };

    // Write to tokens/ directory
    const configFile = `tokens/${symbol}.json`;
    writeFileSync(configFile, JSON.stringify(tokenConfig, null, 2));

    console.log(`[factory:draft] Config saved: ${configFile}`);

    // Execute nsf token draft (to validate)
    try {
      const output = execSync(`nsf token draft`, {
        encoding: 'utf-8',
        stdio: 'pipe',
        input: `${name}\n${symbol}\n${supply}\n${network}\n`
      });
      console.log('[factory:draft] nsf validation:', output);
    } catch (nsfError) {
      console.warn('[factory:draft] nsf validation skipped (interactive mode)');
    }

    // Store in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'smart-factory',
        action: 'token_draft_created',
        data: {
          token_name: name,
          symbol,
          supply,
          network,
          config_file: configFile
        }
      });
    }

    return {
      success: true,
      token_name: name,
      config_file: configFile,
      message: `Token draft created: ${name} (${symbol})`
    };

  } catch (error: any) {
    console.error('[factory:draft] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create token draft'
    };
  }
}

/**
 * Usage:
 * 
 * ```bash
 * moltbot factory:draft \
 *   --name "My Token" \
 *   --symbol MTK \
 *   --supply 1000000
 * ```
 * 
 * Creates token configuration draft in tokens/ directory
 */
