/**
 * NEO CLI: neo:help command
 */

import { NEO_PROTOCOL_INFO } from "../sdk/index.js";

export async function neoHelpCommand(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           NEO PROTOCOL STACK v${NEO_PROTOCOL_INFO.version} - HELP          ║
╚════════════════════════════════════════════════════════════╝

📦 SKILLS REGISTRY
───────────────────────────────────────────────────────────
  neo:skill:publish <path>          Publica skill no IPFS
  neo:skill:install <name[@ver]>    Instala skill do IPFS
  neo:skill:list [--search <q>]     Lista skills disponíveis
  neo:skill:search <query>          Busca skills por nome/tag
  neo:index:create                  Cria índice vazio no IPFS

🔐 IDENTITY (mio-system)
───────────────────────────────────────────────────────────
  neo:identity:list                 Lista identidades ativas
  neo:identity:create               Cria nova identidade
  neo:identity:verify <mio-id>      Verifica identidade

📡 IPFS
───────────────────────────────────────────────────────────
  neo:ipfs:status                   Status do node IPFS
  neo:ipfs:publish <path>           Publica arquivo no IPFS
  neo:ipfs:pin <cid>                Pina CID no node local

ℹ️  INFO
───────────────────────────────────────────────────────────
  neo:info                          Visão geral do protocolo
  neo:help                          Este menu
  neo:version                       Versão atual

🔗 Links
───────────────────────────────────────────────────────────
  GitHub:   ${NEO_PROTOCOL_INFO.links.github}
  Docs:     ${NEO_PROTOCOL_INFO.links.docs}

💡 Exemplos
───────────────────────────────────────────────────────────
  pnpm neobot neo:skill:list
  pnpm neobot neo:skill:publish ./skills/my-skill
  pnpm neobot neo:skill:search ipfs
  pnpm neobot neo:info
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  neoHelpCommand().catch(console.error);
}
