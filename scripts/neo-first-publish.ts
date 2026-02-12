#!/usr/bin/env node --import tsx
/**
 * NEO First Publish - Quick Start Script
 * 
 * Valida infraestrutura e publica primeira skill no IPFS
 * Maior impacto positivo: demonstra funcionamento end-to-end
 */

import { config } from "dotenv";
import { createNeoSkillsRegistry } from "../src/neo/registry/index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

config();

async function checkIPFS(): Promise<boolean> {
  try {
    const response = await fetch("http://127.0.0.1:5001/api/v0/id", {
      method: "POST",
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     NEO PROTOCOL - FIRST SKILL PUBLISH                    ║
║     Quick Start: Index + First Skill                       ║
╚════════════════════════════════════════════════════════════╝
`);

  // 1. Verifica IPFS
  console.log("🔍 Step 1: Checking IPFS node...");
  const ipfsRunning = await checkIPFS();
  
  if (!ipfsRunning) {
    console.error("❌ IPFS daemon is not running!");
    console.error("");
    console.error("💡 Start IPFS:");
    console.error("   ipfs daemon");
    console.error("");
    console.error("   Or check if it's running on a different port.");
    process.exit(1);
  }
  console.log("✅ IPFS node is running\n");

  // 2. Cria registry
  console.log("📦 Step 2: Initializing registry...");
  const registry = createNeoSkillsRegistry();
  console.log("✅ Registry initialized\n");

  // 3. Verifica se já existe index
  console.log("📋 Step 3: Checking for existing index...");
  const indexCID = process.env.NEO_INDEX_CID;
  
  if (indexCID) {
    console.log(`✅ Found existing index CID: ${indexCID}`);
    registry.setIndexCID(indexCID);
    console.log("   Using existing index\n");
  } else {
    console.log("📝 No index found, creating new one...");
    try {
      const newIndexCID = await registry.createIndex();
      console.log(`✅ Index created: ${newIndexCID}`);
      console.log("");
      console.log("💡 Save this CID:");
      console.log(`   export NEO_INDEX_CID=${newIndexCID}`);
      console.log(`   Or add to .env: NEO_INDEX_CID=${newIndexCID}`);
      console.log("");
    } catch (error: any) {
      console.error(`❌ Failed to create index: ${error.message}`);
      process.exit(1);
    }
  }

  // 4. Publica primeira skill
  console.log("🚀 Step 4: Publishing first skill...");
  const skillPath = path.join(process.cwd(), "skills", "neo-ipfs-status");
  
  try {
    await fs.access(skillPath);
  } catch {
    console.error(`❌ Skill not found: ${skillPath}`);
    process.exit(1);
  }

  // Carrega skill.json
  const skillJsonPath = path.join(skillPath, "skill.json");
  const skillJSON = JSON.parse(await fs.readFile(skillJsonPath, "utf-8"));

  console.log(`   Skill: ${skillJSON.name}`);
  console.log(`   ID: ${skillJSON.id}@${skillJSON.version}`);
  console.log("");

  try {
    const cid = await registry.publish(
      {
        id: skillJSON.id,
        name: skillJSON.name,
        version: skillJSON.version,
        author: skillJSON.author,
        category: skillJSON.category,
        metadata: skillJSON.metadata,
        files: skillJSON.files,
      },
      skillPath,
    );

    console.log("");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                    ✅ SUCCESS!                             ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("");
    console.log(`🎉 First skill published to IPFS!`);
    console.log(`   CID: ${cid}`);
    console.log("");
    console.log("📋 Next Steps:");
    console.log(`   1. View skill: ipfs cat ${cid}`);
    console.log(`   2. Gateway: http://127.0.0.1:8080/ipfs/${cid}`);
    console.log(`   3. Install: pnpm neobot neo:skill:install ${skillJSON.id}@${skillJSON.version}`);
    console.log(`   4. List: pnpm neobot neo:skill:list`);
    console.log("");
    console.log("🎯 NEO Protocol Phase 1 - Foundation Progress:");
    console.log("   ✅ IPFS Registry: Working");
    console.log("   ✅ First Skill: Published");
    console.log("   ⏳ Next: Publish more skills, activate identities");
    console.log("");
  } catch (error: any) {
    console.error("");
    console.error(`❌ Failed to publish skill: ${error.message}`);
    console.error("");
    console.error("💡 Troubleshooting:");
    console.error("   1. Check IPFS is running: curl -X POST http://127.0.0.1:5001/api/v0/id");
    console.error("   2. Verify skill.json is valid");
    console.error("   3. Check IPFS storage: ipfs repo stat");
    console.error("");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
