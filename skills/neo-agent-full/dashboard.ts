/**
 * FlowCloser Dashboard Skill
 * 
 * Abre o dashboard de leads do FlowCloser
 * no browser padrão.
 * 
 * Usage:
 *   moltbot flowcloser:dashboard
 *   moltbot flowcloser:dashboard --production
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

interface IntegrationConfig {
  location: {
    production: string;
  };
  endpoints: {
    dashboard: string;
  };
}

export const metadata = {
  name: 'flowcloser:dashboard',
  description: 'Open FlowCloser leads dashboard in browser',
  category: 'flowcloser',
  tags: ['dashboard', 'ui', 'leads', 'browser'],
  version: '1.0.0',
  author: 'NEØ Protocol'
};

export async function execute(ctx: any) {
  try {
    // Read integration config
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: IntegrationConfig = JSON.parse(configContent);
    
    // Determine which URL to use
    const useProduction = 
      ctx.args.production === 'true' || 
      ctx.args.prod === 'true' ||
      ctx.args.p === 'true';
    
    const baseUrl = useProduction 
      ? config.location.production
      : 'http://localhost:8042';
    
    const dashboardUrl = baseUrl + config.endpoints.dashboard;
    
    // Open in default browser
    await execAsync(`open "${dashboardUrl}"`);
    
    return {
      success: true,
      url: dashboardUrl,
      environment: useProduction ? 'production' : 'local',
      message: `✅ Dashboard opened: ${dashboardUrl}`
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Failed to open dashboard',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure FlowCloser is running or use --production flag'
    };
  }
}
