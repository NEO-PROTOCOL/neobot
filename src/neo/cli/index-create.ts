/**
 * NEO CLI: neo:index:create command
 *
 * Cria um novo index vazio no IPFS para o Skills Registry
 */

import { createNeoSkillsRegistry } from "../registry/index.js";

/**
 * Comando: neo:index:create
 *
 * Cria um novo index IPFS
 */
export async function indexCreateCommand(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        NEO SKILLS REGISTRY - CREATE INDEX                  ║
╚════════════════════════════════════════════════════════════╝
`);

  console.log("📦 Creating new skills index on IPFS...");
  console.log("");

  const registry = createNeoSkillsRegistry();

  try {
    const indexCID = await registry.createIndex();

    console.log("");
    console.log("✅ Index created successfully!");
    console.log(`   CID: ${indexCID}`);
    console.log("");
    console.log("📋 Important:");
    console.log(`   - Save this CID in your configuration`);
    console.log(`   - Set via: NEO_INDEX_CID=${indexCID}`);
    console.log(`   - Pin on multiple nodes for redundancy`);
    console.log("");
    console.log("📋 Next steps:");
    console.log("   1. Export: export NEO_INDEX_CID=" + indexCID);
    console.log("   2. Publish first skill: pnpm neobot neo:skill:publish <path>");
    console.log("   3. Pin on additional nodes: ipfs pin add " + indexCID);
    console.log("");
  } catch (error: any) {
    console.error("");
    console.error(`❌ Failed to create index: ${error.message}`);
    console.error("");
    console.error("💡 Troubleshooting:");
    console.error("   1. Ensure IPFS daemon is running: ipfs daemon");
    console.error("   2. Check IPFS API is accessible: curl http://127.0.0.1:5001/api/v0/id");
    console.error("   3. Check available storage: ipfs repo stat");
    console.error("");
    process.exit(1);
  }
}

/**
 * Executa comando
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(`
Usage: pnpm neobot neo:index:create

Creates a new empty skills index on IPFS.

Description:
  The index is a JSON file that tracks all published skills and their versions.
  This CID should be pinned and distributed across multiple nodes for redundancy.

Examples:
  pnpm neobot neo:index:create

Requirements:
  - IPFS daemon must be running (ipfs daemon)

Notes:
  - This only needs to be run once to bootstrap the registry
  - The index CID will change every time a skill is published
  - Save the latest CID in your configuration
    `);
    process.exit(0);
  }

  indexCreateCommand().catch(console.error);
}
