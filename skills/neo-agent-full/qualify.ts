/**
 * FlowCloser Qualify Lead Skill
 * 
 * Qualifica um lead específico consultando
 * os dados do FlowCloser via filesystem.
 * 
 * Usage:
 *   moltbot flowcloser:qualify --leadId=abc123
 *   moltbot flowcloser:qualify --leadId=abc123 --verbose
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface Lead {
  id: string;
  name: string;
  company?: string;
  score: number;
  qualified: boolean;
  status: string;
  platform: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

interface IntegrationConfig {
  data: {
    leads_json: string;
  };
}

export const metadata = {
  name: 'flowcloser:qualify',
  description: 'Qualify a FlowCloser lead by ID',
  category: 'flowcloser',
  tags: ['leads', 'sales', 'qualification', 'scoring'],
  version: '1.0.0',
  author: 'NEØ Protocol'
};

export async function execute(ctx: any) {
  const leadId = ctx.args.leadId || ctx.args.id;
  const verbose = ctx.args.verbose === 'true' || ctx.args.v === 'true';
  
  if (!leadId) {
    return {
      success: false,
      error: 'Missing required parameter: leadId',
      usage: 'moltbot flowcloser:qualify --leadId=<uuid>',
      hint: 'Use flowcloser:list to see available lead IDs'
    };
  }
  
  try {
    // Read integration config
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    
    const configContent = await readFile(configPath, 'utf-8');
    const config: IntegrationConfig = JSON.parse(configContent);
    
    // Read leads data
    const leadsPath = config.data.leads_json;
    const leadsContent = await readFile(leadsPath, 'utf-8');
    const leads: Lead[] = JSON.parse(leadsContent);
    
    // Find lead by ID
    const lead = leads.find((l: Lead) => l.id === leadId);
    
    if (!lead) {
      return {
        success: false,
        error: 'Lead not found',
        leadId,
        hint: 'Check the lead ID and try again'
      };
    }
    
    // Calculate qualification details
    const qualificationStatus = lead.qualified ? '✅ QUALIFIED' : '❌ NOT QUALIFIED';
    const scoreGrade = getScoreGrade(lead.score);
    
    // Prepare response
    const response: any = {
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        company: lead.company || 'N/A',
        score: lead.score,
        scoreGrade,
        qualified: lead.qualified,
        status: lead.status,
        platform: lead.platform,
        created: formatDate(lead.created_at)
      },
      qualification: qualificationStatus,
      message: `Lead "${lead.name}" - Score: ${lead.score}/100 - ${qualificationStatus}`
    };
    
    // Add full details if verbose
    if (verbose) {
      response.fullDetails = lead;
    }
    
    return response;
    
  } catch (error) {
    return {
      success: false,
      error: 'Failed to qualify lead',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure FlowCloser data exists and is accessible'
    };
  }
}

function getScoreGrade(score: number): string {
  if (score >= 80) return 'A (Excellent)';
  if (score >= 60) return 'B (Good)';
  if (score >= 40) return 'C (Fair)';
  return 'D (Poor)';
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return isoDate;
  }
}
