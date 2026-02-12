/**
 * NEO CLI: neo:info command
 *
 * Exibe informações do NEO Protocol Stack
 */

import { NEO_PROTOCOL_INFO } from "../sdk/index.js";
import { listIdentities } from "../identity/registry.js";

/**
 * Comando: neo:info
 *
 * Exibe informações gerais do NEO Protocol
 */
export async function neoInfoCommand(): Promise<void> {
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
  identities.forEach((id: { id: string; role: string; name: string }) => {
    console.log(`  ${id.id.padEnd(15)} │ ${id.role}`);
  });

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
  Fase Atual:   1.0 - Foundation (Em Progresso)
  Skills:       18 implementadas (0 no IPFS registry)
  Identities:   9 registradas (0 ativas)
  Extensions:   0 instaladas

🚀 Próximos Passos
───────────────────────────────────────────────────────────
  1. Implementar NEO Skills Registry (IPFS)
  2. Ativar identidades mio-system
  3. Migrar skills para IPFS
  4. Deploy NEO docs

Para mais informações: pnpm neobot neo:help
`);
}

/**
 * Executa comando
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  neoInfoCommand().catch(console.error);
}
