/**
 * NEO Identity Registry
 *
 * Registro das 9 identidades mio-system do protocolo NEO
 */

import type { NeoIdentity } from "./mio-system.js";

/**
 * Template de identidades NEO (sem chaves privadas)
 *
 * IMPORTANTE: Private keys devem estar em .env (nunca commitar!)
 */
export const NEO_IDENTITY_TEMPLATES = [
  {
    id: "mio-core",
    role: "System Core",
    permissions: {
      channels: ["*"],
      skills: ["*"],
      tools: ["*"],
    },
    metadata: {
      name: "NEO Core System",
      bio: "Sistema principal do protocolo NEO. Gerencia inicialização, health checks e coordenação geral.",
    },
  },

  {
    id: "mio-gateway",
    role: "Gateway Manager",
    permissions: {
      channels: ["*"],
      skills: ["*"],
      tools: ["routing", "sessions", "websocket"],
    },
    metadata: {
      name: "NEO Gateway",
      bio: "Gerenciador de canais, roteamento e sessões. Interface principal entre usuários e o protocolo.",
    },
  },

  {
    id: "mio-skills",
    role: "Skills Registry",
    permissions: {
      channels: [],
      skills: ["*"],
      tools: ["ipfs", "read", "write"],
    },
    metadata: {
      name: "NEO Skills Manager",
      bio: "Gerenciador do registro descentralizado de skills (IPFS). Publica, instala e verifica skills.",
    },
  },

  {
    id: "mio-factory",
    role: "Smart Factory",
    permissions: {
      channels: ["telegram", "whatsapp"],
      skills: ["smart-factory"],
      tools: ["blockchain", "deploy", "mint", "read"],
    },
    metadata: {
      name: "Smart Factory Manager",
      bio: "Gerenciador de contratos inteligentes na Flow Blockchain. Deploy, mint e verificação de NFTs.",
    },
  },

  {
    id: "mio-flowpay",
    role: "FlowPay System",
    permissions: {
      channels: ["telegram", "whatsapp"],
      skills: ["flowpay"],
      tools: ["blockchain", "tokens", "transactions", "read"],
    },
    metadata: {
      name: "FlowPay Manager",
      bio: "Sistema de pagamentos e gestão de tokens Flow. Compra, venda e transferências.",
    },
  },

  {
    id: "mio-asi1",
    role: "ASI1 LLM",
    permissions: {
      channels: ["telegram", "whatsapp"],
      skills: ["asi1-llm"],
      tools: ["ai", "inference", "read"],
    },
    metadata: {
      name: "ASI1 LLM Agent",
      bio: "Modelo de linguagem local (llama.cpp). Inferência AI descentralizada e privada.",
    },
  },

  {
    id: "mio-telegram",
    role: "Telegram Bot",
    permissions: {
      channels: ["telegram"],
      skills: ["telegram"],
      tools: ["messaging", "read", "write"],
    },
    metadata: {
      name: "NEO Telegram",
      bio: "Bot Telegram oficial do protocolo NEO. Interface de comandos e automações.",
    },
  },

  {
    id: "mio-whatsapp",
    role: "WhatsApp Gateway",
    permissions: {
      channels: ["whatsapp"],
      skills: ["whatsapp"],
      tools: ["messaging", "media", "read", "write"],
    },
    metadata: {
      name: "NEO WhatsApp",
      bio: "Gateway WhatsApp do protocolo NEO. Comunicação end-to-end encrypted.",
    },
  },

  {
    id: "mio-ipfs",
    role: "IPFS Node",
    permissions: {
      channels: [],
      skills: ["ipfs"],
      tools: ["ipfs", "storage", "pinning", "pubsub"],
    },
    metadata: {
      name: "NEO IPFS",
      bio: "Nó IPFS descentralizado. Armazenamento, pinning e comunicação via PubSub.",
    },
  },
] as const;

/**
 * Tipo das identidades NEO
 */
export type NeoIdentityRole = (typeof NEO_IDENTITY_TEMPLATES)[number]["role"];

/**
 * Busca template de identidade por ID
 */
export function getIdentityTemplate(id: string) {
  return NEO_IDENTITY_TEMPLATES.find((t) => t.id === id);
}

/**
 * Busca template de identidade por role
 */
export function getIdentityByRole(role: NeoIdentityRole) {
  return NEO_IDENTITY_TEMPLATES.find((t) => t.role === role);
}

/**
 * Lista todas as identidades NEO
 */
export function listIdentities() {
  return NEO_IDENTITY_TEMPLATES.map((t) => ({
    id: t.id,
    role: t.role,
    name: t.metadata.name,
  }));
}

/**
 * Verifica se uma identidade possui permissão
 */
export function hasPermission(
  identity: Pick<NeoIdentity, "permissions">,
  type: "channels" | "skills" | "tools",
  value: string,
): boolean {
  const permissions = identity.permissions[type];
  return permissions.includes("*") || permissions.includes(value);
}
