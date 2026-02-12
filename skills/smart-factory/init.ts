/**
 * Smart Factory Init Skill
 * Initializes token environment via nsf CLI
 * 
 * Wraps: nsf init
 */

import { execSync } from 'child_process';

export const metadata = {
  name: 'factory:init',
  description: 'Initialize Smart Factory token environment',
  category: 'smart-factory',
  tags: ['factory', 'init', 'setup'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'high'
};

interface InitOutput {
  success: boolean;
  message?: string;
  path?: string;
  error?: string;
}

export async function execute(ctx: any): Promise<InitOutput> {
  try {
    console.log('[factory:init] Initializing Smart Factory environment...');

    // Check if nsf CLI is installed
    try {
      execSync('which nsf', { stdio: 'pipe' });
    } catch {
      return {
        success: false,
        error: 'nsf CLI not installed. Install: git clone + npm link'
      };
    }

    // Execute nsf init
    const output = execSync('nsf init', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    console.log('[factory:init] nsf output:', output);

    // Store in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'smart-factory',
        action: 'environment_initialized',
        data: {
          cli_version: '0.5.3',
          timestamp: new Date().toISOString()
        }
      });
    }

    return {
      success: true,
      message: 'Smart Factory environment initialized',
      path: './tokens/'
    };

  } catch (error: any) {
    console.error('[factory:init] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initialize environment'
    };
  }
}

/**
 * Usage:
 * 
 * ```bash
 * moltbot factory:init
 * ```
 * 
 * Initializes token environment for Smart Factory
 */
