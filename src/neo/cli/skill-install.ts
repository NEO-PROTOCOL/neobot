/**
 * NEO CLI: neo:skill:install command
 *
 * Instala uma skill do NEO Skills Registry (IPFS)
 */

import { createNeoSkillsRegistry } from "../registry/index.js";
import * as path from "node:path";

/**
 * Comando: neo:skill:install
 *
 * Instala uma skill do IPFS
 */
export async function skillInstallCommand(
  skillSpec: string,
  options?: {
    path?: string;
  },
): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        NEO SKILLS REGISTRY - INSTALL SKILL                 ║
╚════════════════════════════════════════════════════════════╝
`);

  console.log(`📦 Installing: ${skillSpec}`);
  console.log("");

  // Cria registry client
  const registry = createNeoSkillsRegistry();

  // Define path de instalação
  const targetPath = options?.path || path.join(process.cwd(), "skills", skillSpec.split("@")[0]);

  console.log(`📥 Downloading from IPFS...`);
  console.log(`   Target: ${targetPath}`);
  console.log("");

  try {
    const installPath = await registry.install(skillSpec, targetPath);

    // Read manifest after install to get details
    const manifestPath = path.join(installPath, "skill.json");
    const manifestContent = await import("fs/promises").then((fs) =>
      fs.readFile(manifestPath, "utf-8"),
    );
    const skill = JSON.parse(manifestContent);

    console.log("");
    console.log("✅ Skill installed successfully!");
    console.log(`   Name:    ${skill.name}`);
    console.log(`   Version: ${skill.version}`);
    console.log(`   Author:  ${skill.author}`);
    console.log(`   Path:    ${installPath}`);
    console.log("");
    console.log("📋 Next steps:");
    console.log(`   - View skill: cd ${installPath}`);
    console.log("");
  } catch (error: any) {
    console.error("");
    console.error(`❌ Failed to install skill: ${error.message}`);
    console.error("");
    console.error("💡 Troubleshooting:");
    console.error("   1. Ensure IPFS daemon is running: ipfs daemon");
    console.error("   2. Check skill exists: pnpm neobot neo:skill:list");
    console.error("   3. Verify skillSpec format: skill-id@version or skill-id");
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
Usage: pnpm neobot neo:skill:install <skill-spec> [options]

Installs a skill from the NEO Skills Registry (IPFS).

Arguments:
  skill-spec    Skill specification (skill-id@version or skill-id for latest)

Options:
  --path <dir>  Custom installation directory (default: ./skills/<skill-id>)

Examples:
  pnpm neobot neo:skill:install neo-ipfs-status
  pnpm neobot neo:skill:install neo-ipfs-status@1.0.0
  pnpm neobot neo:skill:install neo-ipfs-status --path ~/custom/path

Requirements:
  - IPFS daemon must be running (ipfs daemon)
  - Skill must be published in the registry
    `);
    process.exit(0);
  }

  const skillSpec = args[0];

  const pathIndex = args.indexOf("--path");
  const customPath = pathIndex !== -1 ? args[pathIndex + 1] : undefined;

  skillInstallCommand(skillSpec, { path: customPath }).catch(console.error);
}
