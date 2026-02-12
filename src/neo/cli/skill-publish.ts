/**
 * NEO CLI: neo:skill:publish command
 *
 * Publica uma skill no NEO Skills Registry (IPFS)
 */

import { createNeoSkillsRegistry } from "../registry/index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

interface SkillJSON {
  id: string;
  name: string;
  version: string;
  author: string;
  category: string[];
  metadata: {
    description: string;
    dependencies: string[];
    permissions: string[];
    repository?: string;
    license?: string;
  };
  files: {
    main: string;
    readme: string;
    config?: string;
  };
}

/**
 * Comando: neo:skill:publish
 *
 * Publica uma skill no IPFS
 */
export async function skillPublishCommand(skillPath: string): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        NEO SKILLS REGISTRY - PUBLISH SKILL                ║
╚════════════════════════════════════════════════════════════╝
`);

  // Valida que o diretório existe
  try {
    await fs.access(skillPath);
  } catch {
    console.error(`❌ Skill directory not found: ${skillPath}`);
    process.exit(1);
  }

  // Carrega skill.json
  const skillJsonPath = path.join(skillPath, "skill.json");

  let skillJSON: SkillJSON;

  try {
    const content = await fs.readFile(skillJsonPath, "utf-8");
    skillJSON = JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load skill.json: ${String(error)}`);
    console.error(`   Expected at: ${skillJsonPath}`);
    process.exit(1);
  }

  // Valida campos obrigatórios
  const requiredFields = ["id", "name", "version", "author", "category", "metadata", "files"];

  for (const field of requiredFields) {
    if (!(field in skillJSON)) {
      console.error(`❌ Missing required field in skill.json: ${field}`);
      process.exit(1);
    }
  }

  console.log(`📦 Skill: ${skillJSON.name}`);
  console.log(`   ID:      ${skillJSON.id}`);
  console.log(`   Version: ${skillJSON.version}`);
  console.log(`   Author:  ${skillJSON.author}`);
  console.log(`   Path:    ${skillPath}`);
  console.log("");

  // Cria registry client
  const registry = createNeoSkillsRegistry();

  console.log("📤 Publishing to IPFS...");
  console.log("");

  try {
    const { cid } = await registry.publish(skillPath);

    const lighthouseConfigured = !!process.env.LIGHTHOUSE_API_KEY;
    const pinataGateway = process.env.PINATA_GATEWAY_URL;

    console.log("");
    console.log("✅ Skill published successfully!");
    console.log(`   CID: ${cid}`);
    console.log("");
    console.log("📋 Access URLs:");
    console.log(`   - Local Gateway: http://127.0.0.1:8080/ipfs/${cid}`);
    console.log(`   - Public IPFS:   https://ipfs.io/ipfs/${cid}`);
    if (lighthouseConfigured) {
      console.log(`   - Lighthouse:    https://gateway.lighthouse.storage/ipfs/${cid}`);
      console.log(`     ✅ Web3 decentralized storage (pinned remotely)`);
    }
    if (pinataGateway) {
      console.log(`   - Pinata Gateway: ${pinataGateway}/ipfs/${cid}`);
      console.log(`     ⚠️  Note: Pinata gateway requires paid plan for pin by CID`);
    }
    console.log(`   - IPFS CLI: ipfs cat ${cid}`);
    console.log("");
    console.log("📋 Next steps:");
    console.log(`   - Install: pnpm neobot neo skill install ${skillJSON.id}@${skillJSON.version}`);
    console.log(`   - List:    pnpm neobot neo skill list`);
    console.log("");
  } catch (error: any) {
    console.error("");
    console.error(`❌ Failed to publish skill: ${error.message}`);
    console.error("");
    console.error("💡 Troubleshooting:");
    console.error("   1. Ensure IPFS daemon is running: ipfs daemon");
    console.error("   2. Check API endpoint: curl http://127.0.0.1:5001/api/v0/id");
    console.error("   3. Verify skill.json is valid");
    console.error("");
    process.exit(1);
  }
}

/**
 * Executa comando
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
Usage: pnpm neobot neo:skill:publish <skill-path>

Publishes a skill to the NEO Skills Registry (IPFS).

Arguments:
  skill-path    Path to the skill directory

Examples:
  pnpm neobot neo:skill:publish ./skills/neo-ipfs-status
  pnpm neobot neo:skill:publish /absolute/path/to/skill

Requirements:
  - IPFS daemon must be running (ipfs daemon)
  - Skill directory must contain skill.json
  - All files referenced in skill.json must exist
    `);
    process.exit(0);
  }

  const skillPath = args[0];
  skillPublishCommand(skillPath).catch(console.error);
}
