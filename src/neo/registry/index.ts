/**
 * NEO Skills Registry - IPFS-based decentralized skills repository
 *
 * Substitui: ClawdHub (https://clawdhub.com)
 * Protocolo: IPFS (Content-Addressed Storage)
 */

import { create as createIPFSClient, type KuboRPCClient } from "kubo-rpc-client";
import { CID } from "multiformats/cid";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Readable } from "node:stream";

/**
 * Schema de uma NEO Skill
 */
export interface NeoSkill {
  id: string; // Identificador único (ex: "ipfs-status")
  name: string; // Nome legível (ex: "IPFS Status Checker")
  version: string; // SemVer (ex: "1.0.0")
  cid: string; // IPFS Content ID
  author: string; // mio-identity (ex: "mio-skills")
  category: string[]; // Tags (ex: ["storage", "blockchain"])

  metadata: {
    description: string; // Descrição da skill
    dependencies: string[]; // Dependências npm
    permissions: string[]; // Permissões necessárias
    repository?: string; // URL do repo (opcional)
    license?: string; // Licença (default: MIT)
  };

  files: {
    main: string; // Entry point (ex: "index.ts")
    readme: string; // SKILL.md
    config?: string; // config.ts (opcional)
  };

  signature: string; // Assinatura Web3 do autor
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Index IPFS - contém lista de todas as skills
 */
export interface NeoSkillsIndex {
  version: string; // Versão do index
  skills: Record<
    string,
    {
      // Map: skillId → CID
      latest: string; // CID da última versão
      versions: Record<string, string>; // SemVer → CID
    }
  >;
  updatedAt: Date;
}

/**
 * NEO Skills Registry Client
 *
 * @example
 * ```typescript
 * const registry = new NeoSkillsRegistry()
 *
 * // Publicar skill
 * const cid = await registry.publish({
 *   id: 'ipfs-status',
 *   name: 'IPFS Status Checker',
 *   version: '1.0.0',
 *   // ...
 * })
 *
 * // Instalar skill
 * const skill = await registry.install('ipfs-status@1.0.0')
 *
 * // Buscar skills
 * const results = await registry.search('ipfs')
 * ```
 */
export class NeoSkillsRegistry {
  private ipfsEndpoint: string;
  private ipfsClient: KuboRPCClient | null = null;
  private indexCID: string | null = null;
  private cachedIndex: NeoSkillsIndex | null = null;

  constructor(options?: { ipfsEndpoint?: string; indexCID?: string }) {
    this.ipfsEndpoint = options?.ipfsEndpoint || "http://127.0.0.1:5001";
    this.indexCID = options?.indexCID || null;
  }

  /**
   * Inicializa cliente IPFS
   */
  private async getClient(): Promise<KuboRPCClient> {
    if (!this.ipfsClient) {
      this.ipfsClient = createIPFSClient({ url: this.ipfsEndpoint });
    }
    return this.ipfsClient;
  }

  /**
   * Publica uma skill no IPFS
   */
  async publish(
    skill: Omit<NeoSkill, "cid" | "signature" | "createdAt" | "updatedAt">,
    skillPath: string,
  ): Promise<string> {
    const client = await this.getClient();

    // Valida que o diretório existe
    try {
      await fs.access(skillPath);
    } catch {
      throw new Error(`Skill directory not found: ${skillPath}`);
    }

    // Adiciona o diretório completo no IPFS
    const results: Array<{ path: string; cid: CID }> = [];

    for await (const result of client.addAll(this.readDirectory(skillPath), {
      wrapWithDirectory: true,
      pin: true,
    })) {
      results.push({ path: result.path, cid: result.cid });
    }

    // O último resultado é o diretório root
    const rootResult = results[results.length - 1];
    if (!rootResult) {
      throw new Error("Failed to add skill to IPFS");
    }

    const skillCID = rootResult.cid.toString();

    // Cria objeto NeoSkill completo
    const fullSkill: NeoSkill = {
      ...skill,
      cid: skillCID,
      signature: "", // TODO: Implementar assinatura Web3 em Phase 1.3
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Publica metadata como JSON
    const metadataJSON = JSON.stringify(fullSkill, null, 2);
    const metadataResult = await client.add(metadataJSON, { pin: true });

    // Atualiza o index
    await this.updateIndex(skill.id, skill.version, skillCID);

    console.log(`✅ Skill published: ${skill.id}@${skill.version}`);
    console.log(`   CID: ${skillCID}`);
    console.log(`   Metadata CID: ${metadataResult.cid.toString()}`);

    return skillCID;
  }

  /**
   * Helper: Lê diretório recursivamente para IPFS
   */
  private async *readDirectory(
    dirPath: string,
  ): AsyncGenerator<{ path: string; content: Readable }> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        yield* this.readDirectory(fullPath);
      } else {
        const content = Readable.from(await fs.readFile(fullPath));
        yield {
          path: path.relative(dirPath, fullPath),
          content,
        };
      }
    }
  }

  /**
   * Instala uma skill do IPFS
   */
  async install(skillSpec: string, targetPath?: string): Promise<NeoSkill> {
    const client = await this.getClient();

    // Parse skillSpec: "ipfs-status@1.0.0" ou "ipfs-status" (latest)
    const [skillId, version] = skillSpec.includes("@")
      ? skillSpec.split("@")
      : [skillSpec, undefined];

    // Busca CID da skill no index
    const skillCID = await this.getSkillCID(skillId, version);
    if (!skillCID) {
      throw new Error(`Skill not found: ${skillSpec}`);
    }

    // Define path de instalação
    const installPath = targetPath || path.join(process.cwd(), "skills", skillId);

    // Garante que o diretório pai existe
    await fs.mkdir(path.dirname(installPath), { recursive: true });

    // Baixa arquivos do IPFS
    console.log(`📥 Downloading ${skillId} from IPFS...`);

    // Usa cat para baixar todo o conteúdo
    const chunks: Uint8Array[] = [];

    for await (const chunk of client.cat(CID.parse(skillCID))) {
      chunks.push(chunk);
    }

    const _content = Buffer.concat(chunks);

    // Cria diretório e salva conteúdo
    await fs.mkdir(installPath, { recursive: true });

    // TODO: Implementar descompactação de tar/zip se necessário
    // Por enquanto, assume que é um arquivo único ou precisa ser implementado
    console.warn("⚠️  Install implementation is basic. Full directory download coming in Phase 2.");

    // Lê metadata
    const metadataPath = path.join(installPath, "skill.json");
    const metadataContent = await fs.readFile(metadataPath, "utf-8");
    const skill: NeoSkill = JSON.parse(metadataContent);

    console.log(`✅ Skill installed: ${skill.id}@${skill.version}`);
    console.log(`   Path: ${installPath}`);

    return skill;
  }

  /**
   * Busca skills no registry
   */
  async search(query: string): Promise<NeoSkill[]> {
    const allSkills = await this.list();

    const lowerQuery = query.toLowerCase();

    return allSkills.filter(
      (skill) =>
        skill.id.toLowerCase().includes(lowerQuery) ||
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.metadata.description.toLowerCase().includes(lowerQuery) ||
        skill.category.some((cat) => cat.toLowerCase().includes(lowerQuery)),
    );
  }

  /**
   * Lista todas as skills
   */
  async list(): Promise<NeoSkill[]> {
    const index = await this.loadIndex();

    const skills: NeoSkill[] = [];

    for (const [_skillId, skillVersions] of Object.entries(index.skills)) {
      const latestCID = skillVersions.latest;
      const skill = await this.loadSkillMetadata(latestCID);

      if (skill) {
        skills.push(skill);
      }
    }

    return skills;
  }

  /**
   * Obtém informações de uma skill específica
   */
  async get(skillId: string, version?: string): Promise<NeoSkill | null> {
    const skillCID = await this.getSkillCID(skillId, version);
    if (!skillCID) return null;

    return this.loadSkillMetadata(skillCID);
  }

  /**
   * Verifica a assinatura de uma skill
   */
  async verify(_skill: NeoSkill): Promise<boolean> {
    // TODO: Implementar verificação Web3 em Phase 1.3
    console.warn("Signature verification not implemented yet");
    return true;
  }

  /**
   * Obtém o CID do index atual
   */
  async getIndexCID(): Promise<string> {
    if (this.indexCID) return this.indexCID;

    // TODO: Buscar do DNS ou config em Phase 1.3
    throw new Error("Index CID not configured. Use setIndexCID() to configure.");
  }

  /**
   * Define o CID do index
   */
  setIndexCID(cid: string): void {
    this.indexCID = cid;
    this.cachedIndex = null; // Invalida cache
  }

  /**
   * Cria um novo index vazio
   */
  async createIndex(): Promise<string> {
    const client = await this.getClient();

    const newIndex: NeoSkillsIndex = {
      version: "1.0.0",
      skills: {},
      updatedAt: new Date(),
    };

    const indexJSON = JSON.stringify(newIndex, null, 2);
    const result = await client.add(indexJSON, { pin: true });

    const indexCID = result.cid.toString();
    this.setIndexCID(indexCID);

    console.log(`✅ Index created: ${indexCID}`);

    return indexCID;
  }

  /**
   * Carrega o index do IPFS
   */
  private async loadIndex(): Promise<NeoSkillsIndex> {
    if (this.cachedIndex) return this.cachedIndex;

    const indexCID = await this.getIndexCID();
    const client = await this.getClient();

    const chunks: Uint8Array[] = [];

    for await (const chunk of client.cat(CID.parse(indexCID))) {
      chunks.push(chunk);
    }

    const indexJSON = Buffer.concat(chunks).toString("utf-8");
    this.cachedIndex = JSON.parse(indexJSON);

    return this.cachedIndex!;
  }

  /**
   * Carrega metadata de uma skill do IPFS
   */
  private async loadSkillMetadata(skillCID: string): Promise<NeoSkill | null> {
    try {
      const client = await this.getClient();

      const chunks: Uint8Array[] = [];

      for await (const chunk of client.cat(CID.parse(skillCID))) {
        chunks.push(chunk);
      }

      const metadataJSON = Buffer.concat(chunks).toString("utf-8");
      return JSON.parse(metadataJSON);
    } catch (error) {
      console.error(`Failed to load skill metadata: ${skillCID}`, error);
      return null;
    }
  }

  /**
   * Busca CID de uma skill no index
   */
  private async getSkillCID(skillId: string, version?: string): Promise<string | null> {
    const index = await this.loadIndex();

    const skillVersions = index.skills[skillId];
    if (!skillVersions) return null;

    if (version) {
      return skillVersions.versions[version] || null;
    }

    return skillVersions.latest;
  }

  /**
   * Atualiza o index com uma nova skill
   */
  private async updateIndex(skillId: string, version: string, cid: string): Promise<void> {
    const client = await this.getClient();

    let index: NeoSkillsIndex;

    try {
      index = await this.loadIndex();
    } catch {
      // Se não existe index, cria um novo
      await this.createIndex();
      index = await this.loadIndex();
    }

    // Atualiza ou adiciona skill
    if (!index.skills[skillId]) {
      index.skills[skillId] = {
        latest: cid,
        versions: {},
      };
    }

    index.skills[skillId].versions[version] = cid;
    index.skills[skillId].latest = cid; // Sempre atualiza latest
    index.updatedAt = new Date();

    // Publica novo index
    const indexJSON = JSON.stringify(index, null, 2);
    const result = await client.add(indexJSON, { pin: true });

    const newIndexCID = result.cid.toString();
    this.setIndexCID(newIndexCID);

    console.log(`✅ Index updated: ${newIndexCID}`);
  }
}

/**
 * Factory function
 */
export function createNeoSkillsRegistry(options?: {
  ipfsEndpoint?: string;
  indexCID?: string;
}): NeoSkillsRegistry {
  return new NeoSkillsRegistry(options);
}

/**
 * Exporta tipos
 */
export type { CID };
