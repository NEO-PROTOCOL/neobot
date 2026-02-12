/**
 * NEO CLI: neo:info command
 *
 * Exibe informações do NEO Protocol Stack
 */

import { NEO_PROTOCOL_INFO } from "../sdk/index.js";
import { listIdentities } from "../identity/registry.js";
import { createNeoSkillsRegistry } from "../registry/index.js";
import fs from "node:fs";
import path from "node:path";

/**
 * Comando: neo:info
 *
 * Exibe informações gerais do NEO Protocol
 */
export async function neoInfoCommand(): Promise<void> {
  // Count skills with skill.json
  let totalSkills = 0;
  let skillsWithCid = 0;
  try {
    const registry = createNeoSkillsRegistry();
    const skills = await registry.list();
    totalSkills = skills.length;
    skillsWithCid = skills.filter((s) => s.cid && s.cid !== "local").length;
  } catch {
    // Count manually if registry fails (e.g. IPFS not running)
    const skillsDir = path.resolve(process.cwd(), "skills");
    if (fs.existsSync(skillsDir)) {
      const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
      totalSkills = entries.filter(
        (e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, "skill.json")),
      ).length;
    }
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║           NEO PROTOCOL STACK v${NEO_PROTOCOL_INFO.version} ║
╚════════════════════════════════════════════════════════════╝

📦 Componentes
───────────────────────────────────────────────────────────
  Registry:     ${NEO_PROTOCOL_INFO.components.registry}
  Identity:     ${NEO_PROTOCOL_INFO.components.identity}
  Gateway:      ${NEO_PROTOCOL_INFO.components.gateway}
  Dashboard:    ${NEO_PROTOCOL_INFO.components.dashboard}

🔐 Identidades mio-system
───────────────────────────────────────────────────────────`);

  const identities = listIdentities();
  if (identities.length === 0) {
    console.log("  (nenhuma identidade registrada)");
  } else {
    identities.forEach((id: { id: string; role: string; name: string }) => {
      console.log(`  ${id.id.padEnd(15)} │ ${id.role}`);
    });
  }

  console.log(`
📊 Autonomia
───────────────────────────────────────────────────────────
  NEO Layer:    ${NEO_PROTOCOL_INFO.autonomy.neo} (descentralizado)
  Moltbot Core: ${NEO_PROTOCOL_INFO.autonomy.moltbot} (upstream sync)

🔗 Links
───────────────────────────────────────────────────────────
  GitHub:       ${NEO_PROTOCOL_INFO.links.github}
  Docs:         ${NEO_PROTOCOL_INFO.links.docs}
  Arquitetura:  ${NEO_PROTOCOL_INFO.links.architecture}

📝 Status
───────────────────────────────────────────────────────────
  Fase Atual:   1.0 - Foundation (Finalizando)
  Skills:       ${totalSkills} com skill.json (${skillsWithCid} pinadas no IPFS)
  Identities:   ${identities.length} registradas
  Extensions:   0 instaladas (Fase 2)

🚀 Próximos Passos
───────────────────────────────────────────────────────────
  1. Publicar skills críticas no IPFS
  2. Iniciar Fase 2: IPFS Channel Adapter
  3. Implementar Web3 Signature System
  4. Dashboard NEO Integration

Para mais informações: pnpm neobot neo:help
`);
}

/**
 * Executa comando
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  neoInfoCommand().catch(console.error);
}
