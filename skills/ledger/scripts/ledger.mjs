#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseArgs } from 'node:util';
import { randomUUID } from 'node:crypto';

// Configuration
const HOME_DIR = os.homedir();
const LEDGER_DIR = path.join(HOME_DIR, '.clawdbot', 'ledger');
const LEDGER_FILE = path.join(LEDGER_DIR, 'main.jsonl');
const POLICY_FILE = path.resolve(process.cwd(), 'skills/ledger/policies/allowlist.yaml');

// Ensure storage exists
if (!fs.existsSync(LEDGER_DIR)) {
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'log') {
    await logEvent();
  } else if (command === 'check-policy') {
    await checkPolicy();
  } else if (command === 'search') {
    await searchLedger();
  } else {
    console.error('Unknown command. Use: log, check-policy, search');
    process.exit(1);
  }
}

async function logEvent() {
  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      intent: { type: 'string' },
      skill: { type: 'string' },
      status: { type: 'string' },
      risk: { type: 'string' },
      data: { type: 'string' }, // JSON string
    },
    strict: false,
  });

  const envelope = {
    id: `evt_${randomUUID()}`,
    ts: new Date().toISOString(),
    actor: process.env.USER || 'system',
    skill: values.skill || 'unknown',
    intent: values.intent || 'unknown',
    status: values.status || 'info',
    risk: values.risk || 'low',
    data: values.data ? JSON.parse(values.data) : {},
  };

  const line = JSON.stringify(envelope) + '\n';
  fs.appendFileSync(LEDGER_FILE, line);
  console.log(JSON.stringify({ success: true, id: envelope.id }));
}

async function checkPolicy() {
  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      skill: { type: 'string' },
    },
  });

  if (!values.skill) {
    console.error('Missing --skill');
    process.exit(1);
  }

  // Simple YAML parser replacement since we don't want deps for this bootstrap script yet
  // In a real scenario, use 'yaml' package. Here we grep/text-parse for simplicity in Phase 3 start.
  // Actually, we can use the project's 'yaml' dependency if available, but let's keep it mostly standalone or use regex for the MVP.
  // Wait, 'neobot' has 'yaml' installed. Let's try to import it.
  
  let policy = {};
  try {
     const yamlContent = fs.readFileSync(POLICY_FILE, 'utf-8');
     // Quick and dirty parser for MVP if yaml import fails or if we want to run independent of node_modules location
     // But let's verify if we can rely on node_modules. We should. 
     // For this script to be robust locally let's just use regex for the specific key structure in MVP.
     
     // Look for:   skill_name:\n    risk: value
     const skillRegex = new RegExp(`\\s+${values.skill}:[\\s\\S]*?risk:\\s*(\\w+)`, 'i');
     const match = yamlContent.match(skillRegex);
     
     if (match) {
       policy = { risk: match[1] };
     } else {
       // Default strict
       policy = { risk: 'unknown' }; 
     }
  } catch (e) {
    console.error('Policy file error:', e.message);
    policy = { risk: 'error' };
  }

  const allowed = ['low', 'med'].includes(policy.risk);
  
  console.log(JSON.stringify({
    allowed,
    risk: policy.risk,
    skill: values.skill
  }));
  
  if (!allowed) process.exit(1);
}

async function searchLedger() {
  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      last: { type: 'string' },
    },
  });
  
  const n = parseInt(values.last || '10', 10);
  
  try {
    const data = fs.readFileSync(LEDGER_FILE, 'utf-8');
    const lines = data.trim().split('\n');
    const lastN = lines.slice(-n);
    console.log(lastN.join('\n'));
  } catch (e) {
    console.log('Ledger empty or not found.');
  }
}

main().catch(console.error);
