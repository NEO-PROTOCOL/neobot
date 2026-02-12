/**
 * Smart Factory Doctor Skill
 * Runs diagnostic + health check + audit via nsf CLI
 * 
 * Wraps: nsf doctor
 */

import { execSync } from 'child_process';

export const metadata = {
  name: 'factory:doctor',
  description: 'Run Smart Factory diagnostics and health check',
  category: 'smart-factory',
  tags: ['factory', 'doctor', 'health', 'audit', 'diagnostic'],
  version: '1.0.0',
  author: 'NEØ Protocol',
  priority: 'high'
};

interface DoctorOutput {
  success: boolean;
  health_status?: 'healthy' | 'warning' | 'critical';
  issues?: string[];
  recommendations?: string[];
  report?: string;
  error?: string;
}

export async function execute(ctx: any): Promise<DoctorOutput> {
  try {
    console.log('[factory:doctor] Running Smart Factory diagnostics...');

    // Check if nsf CLI is installed
    try {
      execSync('which nsf', { stdio: 'pipe' });
    } catch {
      return {
        success: false,
        error: 'nsf CLI not installed. Install: git clone + npm link'
      };
    }

    // Execute nsf doctor
    const output = execSync('nsf doctor', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    console.log('[factory:doctor] nsf output:', output);

    // Parse doctor output
    const result = parseDoctorOutput(output);

    // Store in Neobot ledger
    if (ctx.ledger) {
      await ctx.ledger.write({
        actor: 'user',
        channel: 'smart-factory',
        action: 'health_check_performed',
        data: {
          health_status: result.health_status,
          issues_count: result.issues?.length || 0,
          timestamp: new Date().toISOString()
        }
      });
    }

    return {
      success: true,
      ...result
    };

  } catch (error: any) {
    console.error('[factory:doctor] Error:', error);
    
    // If nsf doctor failed, still return partial diagnostic
    return {
      success: false,
      health_status: 'critical',
      issues: ['nsf doctor command failed'],
      error: error.message || 'Failed to run diagnostics'
    };
  }
}

/**
 * Parse nsf doctor output
 */
function parseDoctorOutput(output: string): {
  health_status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  report: string;
} {
  const lines = output.split('\n');
  
  // Extract issues (lines with ❌ or ⚠️)
  const issues = lines.filter(line => 
    line.includes('❌') || line.includes('⚠️') || line.toLowerCase().includes('error')
  );

  // Extract recommendations (lines with 💡 or "recommendation")
  const recommendations = lines.filter(line =>
    line.includes('💡') || line.toLowerCase().includes('recommendation')
  );

  // Determine health status
  let health_status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (issues.some(issue => issue.includes('❌') || issue.toLowerCase().includes('critical'))) {
    health_status = 'critical';
  } else if (issues.length > 0) {
    health_status = 'warning';
  }

  return {
    health_status,
    issues: issues.map(i => i.trim()).filter(Boolean),
    recommendations: recommendations.map(r => r.trim()).filter(Boolean),
    report: output
  };
}

/**
 * Usage:
 * 
 * ```bash
 * moltbot factory:doctor
 * ```
 * 
 * Returns:
 * - Health status (healthy/warning/critical)
 * - List of issues found
 * - Recommendations for fixes
 * - Full diagnostic report
 */
