#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ANSI Colors
const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BLUE = "\x1b[34m";

console.clear();
console.log(`${BRIGHT}${CYAN}================================================================${RESET}`);
console.log(`${BRIGHT}${CYAN}   NEO NODE WARRIOR PROTOCOL :: SYSTEM KICKOFF${RESET}`);
console.log(`${BRIGHT}${CYAN}================================================================${RESET}`);
console.log(`${BRIGHT}${BLUE}   Date: ${new Date().toLocaleString()}${RESET}\n`);

// 1. Warp Check
const termProgram = process.env.TERM_PROGRAM;
if (termProgram === 'WarpTerminal') {
    console.log(`${GREEN}✔ Warp Terminal Detected${RESET}`);
} else {
    // Warp sometimes sets TERM_PROGRAM only in new sessions. 
    // We check generic compatibility too.
    console.log(`${YELLOW}⚠ Not running in Warp (Current: ${termProgram || 'Unknown'})${RESET}`);
    console.log(`  Suggestion: Use Warp for enhanced flows.`);
}

// 2. Load Env (Simple regex parser to avoid dependencies if dotenv not strict)
let envVars = {};
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                envVars[key] = value;
            }
        });
        console.log(`${GREEN}✔ Environment Variables Loaded${RESET}`);
    } else {
        console.log(`${RED}✘ .env file not found!${RESET}`);
    }
} catch (e) {
    console.log(`${RED}✘ Error reading .env: ${e.message}${RESET}`);
}

// 3. API Keys Check (Direct from .env)

// 4. Token Check (Bitwarden / Env)
const notionKey = process.env.NOTION_API_KEY || envVars.NOTION_API_KEY;
const linearKey = process.env.LINEAR_API_KEY || envVars.LINEAR_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY || envVars.ANTHROPIC_API_KEY;
const telegramToken = process.env.TELEGRAM_BOT_TOKEN || envVars.TELEGRAM_BOT_TOKEN;

if (notionKey) {
    const source = process.env.NOTION_API_KEY ? "Process Env" : ".env File";
    console.log(`${GREEN}✔ Notion Connected (${source})${RESET}`);
} else {
    console.log(`${YELLOW}⚠ Notion API Key missing${RESET}`);
}

if (linearKey) {
    const source = process.env.LINEAR_API_KEY ? "Process Env" : ".env File";
    console.log(`${GREEN}✔ Linear Connected (${source})${RESET}`);
} else {
    console.log(`${YELLOW}⚠ Linear API Key missing${RESET}`);
}

if (anthropicKey) {
    console.log(`${GREEN}✔ Anthropic AI Ready${RESET}`);
} else {
    console.log(`${YELLOW}⚠ Anthropic API Key missing${RESET}`);
}

if (telegramToken) {
    console.log(`${GREEN}✔ Telegram Bot active${RESET}`);
} else {
    console.log(`${YELLOW}⚠ Telegram Bot Token missing${RESET}`);
}


// 5. Build Status (Optional - just checking if dist exists)
if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
    console.log(`${GREEN}✔ Build directory exists${RESET}`);
} else {
    console.log(`${YELLOW}⚠ dist/ directory missing (Build required?)${RESET}`);
}

// 6. Roadmap Context
console.log(`\n${BRIGHT}${CYAN}--- CURRENT MISSION CONTEXT ---${RESET}`);
try {
    const possiblePaths = [
        path.join(process.cwd(), 'NEXT_STEPS_V2.md'),
        path.join(process.cwd(), 'docs/core/NEXT_STEPS_V2.md')
    ];
    
    let roadmapPath = null;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            roadmapPath = p;
            break;
        }
    }

    if (roadmapPath) {
        const content = fs.readFileSync(roadmapPath, 'utf8');
        const lines = content.split('\n');
        // Find the "Status Atual" section
        let printing = false;
        let count = 0;
        for (const line of lines) {
            if (line.includes('Status Atual:')) {
                printing = true;
            }
            if (printing && count < 10) { // Aumentado para 10 linhas para mais contexto
                console.log(`${YELLOW}${line}${RESET}`);
                count++;
            }
            if (count >= 10) break;
        }
    } else {
        console.log(`${YELLOW}Roadmap file not found (Checked root and docs/core/)${RESET}`);
    }
} catch (e) {
    console.log(`${RED}Error reading roadmap: ${e.message}${RESET}`);
}

console.log(`\n${BRIGHT}${CYAN}================================================================${RESET}`);
console.log(`${BRIGHT}${GREEN}   SYSTEM READY. WAITING FOR COMMAND.${RESET}`);
console.log(`${BRIGHT}${CYAN}================================================================${RESET}\n`);
