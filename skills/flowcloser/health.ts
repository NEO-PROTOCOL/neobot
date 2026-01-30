/**
 * FlowCloser Health Check Skill
 * 
 * Verifica se FlowCloser Agent está rodando
 * (local e production).
 * 
 * Usage:
 *   moltbot flowcloser:health
 *   moltbot flowcloser:health --verbose
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface HealthResponse {
  status: string;
  timestamp?: string;
  uptime?: number;
}

interface IntegrationConfig {
  location: {
    production: string;
  };
  endpoints: {
    health: string;
  };
}

export const metadata = {
  name: 'flowcloser:health',
  description: 'Check FlowCloser Agent health status',
  category: 'flowcloser',
  tags: ['health', 'monitoring', 'status'],
  version: '1.0.0',
  author: 'NEØ Protocol'
};

export async function execute(ctx: any) {
  const verbose = ctx.args.verbose === 'true' || ctx.args.v === 'true';
  
  try {
    // Read integration config
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: IntegrationConfig = JSON.parse(configContent);
    
    // Check local
    const localUrl = 'http://localhost:8042' + config.endpoints.health;
    const localHealth = await checkHealth(localUrl, 'local', verbose);
    
    // Check production
    const prodUrl = config.location.production + config.endpoints.health;
    const prodHealth = await checkHealth(prodUrl, 'production', verbose);
    
    // Determine overall status
    const allUp = localHealth.status === 'up' || prodHealth.status === 'up';
    
    return {
      success: true,
      overall: allUp ? 'healthy' : 'unhealthy',
      local: localHealth,
      production: prodHealth,
      message: allUp 
        ? '✅ FlowCloser is operational' 
        : '⚠️  FlowCloser is down'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Failed to check health',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure integration.json exists and FlowCloser is configured'
    };
  }
}

async function checkHealth(
  url: string, 
  environment: string,
  verbose: boolean
): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const startTime = Date.now();
    const response = await fetch(url, { 
      signal: controller.signal 
    });
    const duration = Date.now() - startTime;
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { 
        environment,
        status: 'down', 
        url,
        error: `HTTP ${response.status}`
      };
    }
    
    const data: HealthResponse = await response.json();
    
    return { 
      environment,
      status: 'up', 
      url,
      responseTime: `${duration}ms`,
      ...(verbose && data)
    };
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { 
          environment,
          status: 'timeout', 
          url,
          error: 'Timeout after 5s' 
        };
      }
      
      return { 
        environment,
        status: 'down', 
        url,
        error: error.message 
      };
    }
    
    return { 
      environment,
      status: 'down', 
      url,
      error: 'Unknown error' 
    };
  }
}
