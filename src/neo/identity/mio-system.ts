/**
 * mio-system Identity - Web3 Identity System para NEO Protocol
 *
 * Sistema de identidade baseado em assinaturas cryptográficas (Ethereum-style)
 * Cada identidade possui:
 * - ID único: mio-[hash]
 * - Par de chaves (pública/privada)
 * - Roles e permissões
 * - Assinatura verificável
 */

import { ethers } from "ethers";
import * as crypto from "node:crypto";

/**
 * Identidade NEO (mio-system)
 */
export interface NeoIdentity {
  id: string; // mio-[hash] (ex: "mio-abc12345")
  publicKey: string; // Ethereum address (0x...)

  roles: string[]; // Roles (ex: ["system", "gateway", "developer"])

  permissions: {
    channels: string[]; // Canais permitidos (ex: ["whatsapp", "telegram", "*"])
    skills: string[]; // Skills permitidas (ex: ["ipfs-status", "*"])
    tools: string[]; // Tools permitidas (ex: ["read", "write", "exec"])
  };

  metadata: {
    name: string; // Nome legível
    avatar?: string; // Avatar IPFS CID (opcional)
    bio?: string; // Biografia (opcional)
    website?: string; // Website (opcional)
  };

  createdAt: Date;
  signature: string; // Assinatura Web3 da identidade
}

/**
 * Gerenciador de Identidades mio-system
 *
 * @example
 * ```typescript
 * // Criar nova identidade
 * const manager = new MioIdentityManager(privateKey)
 * const identity = await manager.createIdentity({
 *   name: 'NEO Gateway',
 *   bio: 'Gateway principal do protocolo NEO'
 * })
 *
 * // Verificar identidade
 * const isValid = await manager.verifyIdentity(identity)
 * ```
 */
export class MioIdentityManager {
  private wallet: ethers.Wallet;

  constructor(privateKey: string) {
    if (!privateKey) {
      throw new Error("Private key is required");
    }

    // Remove "0x" prefix se presente
    const cleanKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

    try {
      this.wallet = new ethers.Wallet(cleanKey);
    } catch (error) {
      throw new Error(`Invalid private key: ${error}`);
    }
  }

  /**
   * Cria uma nova identidade mio-system
   */
  async createIdentity(
    metadata: {
      name: string;
      avatar?: string;
      bio?: string;
      website?: string;
    },
    options?: {
      roles?: string[];
      permissions?: NeoIdentity["permissions"];
    },
  ): Promise<NeoIdentity> {
    // 1. Gerar publicKey do wallet
    const publicKey = this.wallet.address;

    // 2. Criar ID: mio-[hash dos primeiros 8 chars do publicKey]
    const id = generateMioId(publicKey);

    // 3. Criar objeto identity (sem signature ainda)
    const identity: Omit<NeoIdentity, "signature"> = {
      id,
      publicKey,
      roles: options?.roles || ["user"],
      permissions: options?.permissions || {
        channels: [],
        skills: [],
        tools: ["read"],
      },
      metadata,
      createdAt: new Date(),
    };

    // 4. Criar message canônica para assinar
    const message = this.createCanonicalMessage(identity);

    // 5. Assinar com privateKey
    const signature = await this.wallet.signMessage(message);

    // 6. Retornar identity completa
    const fullIdentity: NeoIdentity = {
      ...identity,
      signature,
    };

    return fullIdentity;
  }

  /**
   * Verifica a assinatura de uma identidade
   */
  async verifyIdentity(identity: NeoIdentity): Promise<boolean> {
    try {
      // 1. Recuperar message original (sem signature)
      const identityWithoutSignature: Omit<NeoIdentity, "signature"> = {
        id: identity.id,
        publicKey: identity.publicKey,
        roles: identity.roles,
        permissions: identity.permissions,
        metadata: identity.metadata,
        createdAt: identity.createdAt,
      };

      const message = this.createCanonicalMessage(identityWithoutSignature);

      // 2. Verificar signature com ethers.verifyMessage
      const recoveredAddress = ethers.verifyMessage(message, identity.signature);

      // 3. Comparar com publicKey da identity
      const isValid = recoveredAddress.toLowerCase() === identity.publicKey.toLowerCase();

      // 4. Verificar que o mio-ID corresponde ao publicKey
      const expectedId = generateMioId(identity.publicKey);
      const idMatches = identity.id === expectedId;

      return isValid && idMatches;
    } catch (error) {
      console.error("Identity verification failed:", error);
      return false;
    }
  }

  /**
   * Assina uma mensagem com a identidade
   */
  async signMessage(message: string): Promise<string> {
    return await this.wallet.signMessage(message);
  }

  /**
   * Cria message canônica para assinatura
   *
   * Formato: JSON determinístico (sorted keys)
   */
  private createCanonicalMessage(identity: Omit<NeoIdentity, "signature">): string {
    // Cria objeto com keys ordenadas para garantir determinismo
    const canonical = {
      id: identity.id,
      publicKey: identity.publicKey,
      roles: identity.roles.sort(),
      permissions: {
        channels: identity.permissions.channels.sort(),
        skills: identity.permissions.skills.sort(),
        tools: identity.permissions.tools.sort(),
      },
      metadata: identity.metadata,
      createdAt: identity.createdAt.toISOString(),
    };

    return JSON.stringify(canonical);
  }

  /**
   * Exporta a identidade para JSON
   */
  toJSON(identity: NeoIdentity): string {
    return JSON.stringify(identity, null, 2);
  }

  /**
   * Importa identidade de JSON
   */
  fromJSON(json: string): NeoIdentity {
    const parsed = JSON.parse(json);

    // Converte createdAt string para Date
    if (typeof parsed.createdAt === "string") {
      parsed.createdAt = new Date(parsed.createdAt);
    }

    return parsed as NeoIdentity;
  }

  /**
   * Obtém o endereço público da wallet
   */
  getPublicKey(): string {
    return this.wallet.address;
  }

  /**
   * Gera um mio-ID para esta wallet
   */
  getMioId(): string {
    return generateMioId(this.wallet.address);
  }
}

/**
 * Factory function
 */
export function createMioIdentityManager(privateKey: string): MioIdentityManager {
  return new MioIdentityManager(privateKey);
}

/**
 * Gera uma nova private key aleatória
 */
export function generatePrivateKey(): string {
  const wallet = ethers.Wallet.createRandom();
  return wallet.privateKey;
}

/**
 * Gera múltiplas identidades (para o bootstrap do sistema)
 */
export async function generateIdentities(count: number): Promise<
  Array<{
    privateKey: string;
    publicKey: string;
    mioId: string;
  }>
> {
  const identities = [];

  for (let i = 0; i < count; i++) {
    const privateKey = generatePrivateKey();
    const manager = new MioIdentityManager(privateKey);
    const publicKey = manager.getPublicKey();
    const mioId = manager.getMioId();

    identities.push({
      privateKey,
      publicKey,
      mioId,
    });
  }

  return identities;
}

/**
 * Valida formato de um mio-ID
 */
export function isValidMioId(id: string): boolean {
  return /^mio-[a-f0-9]{8}$/i.test(id);
}

/**
 * Gera mio-ID de um publicKey
 */
export function generateMioId(publicKey: string): string {
  // Remove "0x" prefix e pega primeiros 8 chars
  const hash = publicKey.replace(/^0x/, "").slice(0, 8).toLowerCase();
  return `mio-${hash}`;
}
