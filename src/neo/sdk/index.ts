/**
 * NEO Protocol SDK
 *
 * SDK público para desenvolvedores integrarem com o NEO Protocol
 */

// Re-export principais interfaces
export type { NeoSkill, NeoSkillsIndex } from "../registry/index.js";
export type { NeoIdentity } from "../identity/mio-system.js";
export type { NeoIdentityRole } from "../identity/registry.js";

// Re-export classes
export { NeoSkillsRegistry, createNeoSkillsRegistry } from "../registry/index.js";
export {
  MioIdentityManager,
  createMioIdentityManager,
  isValidMioId,
  generateMioId,
} from "../identity/mio-system.js";

// Re-export funções úteis
export {
  getIdentityTemplate,
  getIdentityByRole,
  listIdentities,
  hasPermission,
  NEO_IDENTITY_TEMPLATES,
} from "../identity/registry.js";

/**
 * Versão do NEO Protocol
 */
export const NEO_PROTOCOL_VERSION = "1.0.0-alpha";

/**
 * Informações do protocolo NEO
 */
export const NEO_PROTOCOL_INFO = {
  name: "NEO Protocol",
  version: NEO_PROTOCOL_VERSION,
  description: "Camada descentralizada e autônoma sobre OpenClaw Core",

  components: {
    registry: "IPFS-based Skills Registry",
    identity: "mio-system Web3 Identity",
    gateway: "Web3-native Gateway Extensions",
    dashboard: "iOS-style Management UI",
  },

  autonomy: {
    neo: "60%",
    openclaw: "40%",
  },

  links: {
    github: "https://github.com/neomello/neobot",
    docs: "https://neo-docs.mello.eth", // TODO: Deploy IPFS
    architecture: "./ARCHITECTURE_NEO_PROTOCOL.md",
  },
} as const;

/**
 * Helper: Cria cliente NEO completo
 */
export async function createNeoClient(options?: { ipfsApiUrl?: string; privateKey?: string }) {
  const { createNeoSkillsRegistry } = await import("../registry/index.js");
  const { createMioIdentityManager } = await import("../identity/mio-system.js");

  return {
    registry: createNeoSkillsRegistry({
      ipfsApiUrl: options?.ipfsApiUrl,
    }),

    identity: options?.privateKey ? createMioIdentityManager(options.privateKey) : null,

    info: NEO_PROTOCOL_INFO,
  };
}

/**
 * Type guard: verifica se é uma NeoSkill válida
 */
export function isNeoSkill(obj: any): obj is import("../registry/index.js").NeoSkill {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.version === "string" &&
    typeof obj.cid === "string" &&
    typeof obj.author === "string"
  );
}

/**
 * Type guard: verifica se é uma NeoIdentity válida
 */
export function isNeoIdentity(obj: any): obj is import("../identity/mio-system.js").NeoIdentity {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    obj.id.startsWith("mio-") &&
    typeof obj.publicKey === "string" &&
    Array.isArray(obj.roles) &&
    typeof obj.permissions === "object"
  );
}
