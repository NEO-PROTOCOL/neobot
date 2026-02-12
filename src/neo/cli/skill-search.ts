/**
 * NEO CLI: neo:skill:search command
 *
 * Busca skills no NEO Skills Registry por nome, descrição, categoria ou tag
 */

import { createNeoSkillsRegistry } from "../registry/index.js";

export async function skillSearchCommand(query: string): Promise<void> {
  if (!query) {
    console.error("❌ Usage: pnpm neobot neo:skill:search <query>");
    process.exit(1);
  }

  const registry = createNeoSkillsRegistry();
  const q = query.toLowerCase();

  console.log(`
╔════════════════════════════════════════════════════════════╗
║        NEO SKILLS REGISTRY - SEARCH                        ║
╚════════════════════════════════════════════════════════════╝

🔍 Query: "${query}"
`);

  try {
    const allSkills = await registry.list();

    const results = allSkills.filter((s) => {
      const desc = (s.description || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      const id = (s.id || "").toLowerCase();
      const category = Array.isArray(s.category)
        ? s.category.join(" ").toLowerCase()
        : (s.category || "").toLowerCase();

      // Also check metadata tags if present
      const tags = (s as any).metadata?.tags
        ? ((s as any).metadata.tags as string[]).join(" ").toLowerCase()
        : "";

      return (
        id.includes(q) ||
        name.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||
        tags.includes(q)
      );
    });

    if (results.length === 0) {
      console.log(`   No skills found matching "${query}".`);
      console.log("");
      console.log("💡 Tips:");
      console.log("   - Try broader terms (e.g. 'ai', 'storage', 'channel')");
      console.log("   - List all skills: pnpm neobot neo:skill:list");
      console.log("");
      return;
    }

    console.log(
      `Found ${results.length} skill(s) matching "${query}":\n`,
    );

    console.log(
      "┌─────────────────────┬─────────┬──────────────────────────────────────┐",
    );
    console.log(
      "│ Skill ID            │ Version │ Description                          │",
    );
    console.log(
      "├─────────────────────┼─────────┼──────────────────────────────────────┤",
    );

    for (const skill of results) {
      const id = skill.id.padEnd(19).slice(0, 19);
      const version = (skill.version || "?").padEnd(7).slice(0, 7);
      const desc = (skill.description || "").padEnd(36).slice(0, 36);
      console.log(`│ ${id} │ ${version} │ ${desc} │`);
    }

    console.log(
      "└─────────────────────┴─────────┴──────────────────────────────────────┘",
    );
    console.log("");
    console.log("📋 Install a skill:");
    console.log("   pnpm neobot neo:skill:install <skill-id>");
    console.log("");
  } catch (error: any) {
    console.error(`❌ Search failed: ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const query = process.argv.slice(2).join(" ");
  skillSearchCommand(query).catch(console.error);
}
