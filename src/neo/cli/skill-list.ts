/**
 * NEO CLI: neo:skill:list command
 *
 * Lista skills disponíveis no NEO Skills Registry (IPFS)
 */

import { createNeoSkillsRegistry } from "../registry/index.js";

/**
 * Comando: neo:skill:list
 *
 * Lista todas as skills no registry
 */
export async function skillListCommand(options?: { search?: string }): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        NEO SKILLS REGISTRY - AVAILABLE SKILLS              ║
╚════════════════════════════════════════════════════════════╝
`);

  // Cria registry client
  const registry = createNeoSkillsRegistry();

  try {
    const rawSkills = await registry.list();
    let skills = rawSkills;

    if (options?.search) {
      const query = options.search.toLowerCase();
      console.log(`🔍 Searching for: "${options.search}"`);
      console.log("");
      skills = rawSkills.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          (s.category && s.category.toLowerCase().includes(query)),
      );
    } else {
      console.log("📦 All Skills:");
      console.log("");
    }

    if (skills.length === 0) {
      console.log("   No skills found.");
      console.log("");
      console.log("💡 Tips:");
      console.log("   - Publish your first skill: pnpm neobot neo:skill:publish <path>");
      console.log("   - Check index CID is configured");
      console.log("");
      return;
    }

    // Tabela de skills
    console.log("┌─────────────────────┬─────────┬──────────────┬────────────────────┐");
    console.log("│ Skill ID            │ Version │ Author       │ Category           │");
    console.log("├─────────────────────┼─────────┼──────────────┼────────────────────┤");

    for (const skill of skills) {
      const id = skill.id.padEnd(19);
      const version = skill.version.padEnd(7);
      const author = skill.author.padEnd(12);
      const category = (skill.category || "misc").padEnd(18);

      console.log(`│ ${id} │ ${version} │ ${author} │ ${category} │`);
    }

    console.log("└─────────────────────┴─────────┴──────────────┴────────────────────┘");
    console.log("");
    console.log(`Total: ${skills.length} skill(s)`);
    console.log("");
    console.log("📋 Install a skill:");
    console.log("   pnpm neobot neo:skill:install <skill-id>[@version]");
    console.log("");
  } catch (error: any) {
    console.error("");
    console.error(`❌ Failed to list skills: ${error.message}`);
    console.error("");
    console.error("💡 Troubleshooting:");
    console.error("   1. Ensure IPFS daemon is running: ipfs daemon");
    console.error("   2. Check index CID is configured");
    console.error("   3. Create index if needed: pnpm neobot neo:index:create");
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
Usage: pnpm neobot neo:skill:list [options]

Lists available skills in the NEO Skills Registry (IPFS).

Options:
  --search <query>  Search skills by name, description, or category

Examples:
  pnpm neobot neo:skill:list
  pnpm neobot neo:skill:list --search ipfs
  pnpm neobot neo:skill:list --search storage

Requirements:
  - IPFS daemon must be running (ipfs daemon)
  - Index CID must be configured
    `);
    process.exit(0);
  }

  const searchIndex = args.indexOf("--search");
  const search = searchIndex !== -1 ? args[searchIndex + 1] : undefined;

  skillListCommand({ search }).catch(console.error);
}
