#!/usr/bin/env node

import fs from "fs";
import path from "path";

// ANSI Colors
const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BLUE = "\x1b[34m";

console.clear();
console.log(
  `${BRIGHT}${CYAN}================================================================${RESET}`,
);
console.log(`${BRIGHT}${CYAN}   NEO NODE WARRIOR PROTOCOL :: SYSTEM KICKOFF${RESET}`);
console.log(
  `${BRIGHT}${CYAN}================================================================${RESET}`,
);
console.log(`${BRIGHT}${BLUE}   Date: ${new Date().toLocaleString()}${RESET}\n`);

// 1. Warp Check
const termProgram = process.env.TERM_PROGRAM;
if (termProgram === "WarpTerminal") {
  console.log(`${GREEN}✔ Warp Terminal Detected${RESET}`);
} else {
  // Warp sometimes sets TERM_PROGRAM only in new sessions.
  // We check generic compatibility too.
  console.log(`${YELLOW}⚠ Not running in Warp (Current: ${termProgram || "Unknown"})${RESET}`);
  console.log(`  Suggestion: Use Warp for enhanced flows.`);
}

// 2. Load Env (Simple regex parser to avoid dependencies if dotenv not strict)
let envVars = {};
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, "");
        envVars[key] = value;
      }
    });
    console.log(`${GREEN}✔ Environment Variables Loaded${RESET}`);
  }
} catch {
  console.log(`${YELLOW}⚠ Note: Env loaded via tool fallback.${RESET}`);
}

// 3. API Keys Check
const notionKey = process.env.NOTION_API_KEY || envVars.NOTION_API_KEY;
const linearKey = process.env.LINEAR_API_KEY || envVars.LINEAR_API_KEY;
const asiKey = process.env.ASI1AI_API_KEY || envVars.ASI1AI_API_KEY;

if (notionKey) {
  console.log(`${GREEN}✔ Notion Connected${RESET}`);
} else {
  console.log(`${RED}✘ Notion API Key missing${RESET}`);
}

if (linearKey) {
  console.log(`${GREEN}✔ Linear Connected${RESET}`);
} else {
  console.log(`${RED}✘ Linear API Key missing${RESET}`);
}

if (asiKey) {
  console.log(`${GREEN}✔ ASI1.AI (Fallback LLM) Connected${RESET}`);
}

// 5. Build Status (Optional - just checking if dist exists)
if (fs.existsSync(path.join(process.cwd(), "dist"))) {
  console.log(`${GREEN}✔ Build directory exists${RESET}`);
} else {
  console.log(`${YELLOW}⚠ dist/ directory missing (Build required?)${RESET}`);
}

// 6. Roadmap Context
console.log(`\n${BRIGHT}${CYAN}--- CURRENT MISSION CONTEXT ---${RESET}`);
try {
  const roadmapPath = path.join(process.cwd(), "docs/core/NEXT_STEPS_V2.md");
  if (fs.existsSync(roadmapPath)) {
    const content = fs.readFileSync(roadmapPath, "utf8");
    const lines = content.split("\n");
    // Find the "Status Atual" section
    let printing = false;
    let count = 0;
    for (const line of lines) {
      if (line.includes("Status Atual:")) {
        printing = true;
      }
      if (printing && count < 8) {
        console.log(`${YELLOW}${line}${RESET}`);
        count++;
      }
    }
  } else {
    console.log(`${YELLOW}Roadmap context currently restricted or path moved.${RESET}`);
  }
} catch (e) {
  console.log(`${RED}Error reading roadmap: ${e.message}${RESET}`);
}

console.log(
  `\n${BRIGHT}${CYAN}================================================================${RESET}`,
);
console.log(`${BRIGHT}${GREEN}   SYSTEM READY. WAITING FOR COMMAND.${RESET}`);
console.log(
  `${BRIGHT}${CYAN}================================================================${RESET}\n`,
);
