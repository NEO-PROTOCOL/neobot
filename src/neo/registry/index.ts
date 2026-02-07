import { create as createIpfsClient } from "kubo-rpc-client";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { glob } from "glob";
import fs from "fs";

// Types
export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  entryPoint: string; // relative path to main file
  permissions?: string[];
  signature?: string; // Web3 signature
  cid?: string; // IPFS CID after publish
}

export interface NeoRegistryConfig {
  ipfsApiUrl?: string; // e.g., 'http://127.0.0.1:5001'
  localSkillsDir?: string; // e.g., './skills'
}

// Compatibility Aliases for SDK
export type NeoSkill = SkillManifest & { id: string; cid: string };
export interface NeoSkillsIndex {
  updatedAt: string;
  skills: Record<string, { latest: string; versions: Record<string, string> }>;
}

export class NeoSkillsRegistry {
  private ipfs;
  private config: NeoRegistryConfig;

  constructor(config: NeoRegistryConfig = {}) {
    this.config = config;
    const ipfsUrl = process.env.NEO_IPFS_API_URL || config.ipfsApiUrl || "http://127.0.0.1:5001";
    this.ipfs = createIpfsClient({ url: ipfsUrl });
  }

  /**
   * Publish a skill directory to IPFS
   */
  async publish(
    skillDir: string,
    _signer?: any,
  ): Promise<{ cid: string; manifest: SkillManifest }> {
    console.log(`\n📦 Publishing skill from: ${skillDir}...`);

    // 1. Validate Manifest
    const manifestPath = path.join(skillDir, "skill.json");
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Missing skill.json in ${skillDir}`);
    }

    const manifestContent = await readFile(manifestPath, "utf-8");
    const manifest: SkillManifest = JSON.parse(manifestContent);

    // 2. Add files to IPFS
    // We use glob to find all files recursively
    const files = await glob("**/*", {
      cwd: skillDir,
      nodir: true,
      ignore: ["node_modules/**", ".git/**"],
    });

    const ipfsInput = [];
    for (const file of files) {
      const content = await readFile(path.join(skillDir, file));
      ipfsInput.push({
        path: file, // Relative path preserves structure
        content: content,
      });
    }

    console.log(`   Detailed: Uploading ${files.length} files to IPFS node...`);

    // 3. Upload Directory
    // 'wrapWithDirectory: true' creates a folder with the hash
    let rootCid = "";
    for await (const result of this.ipfs.addAll(ipfsInput, { wrapWithDirectory: true })) {
      // The last result with empty path is the root directory
      if (result.path === "") {
        rootCid = result.cid.toString();
      }
    }

    if (!rootCid) throw new Error("Failed to get root CID from IPFS addAll");

    console.log(`✅ Published! CID: ${rootCid}`);
    console.log(`   Skill: ${manifest.name} v${manifest.version}`);

    // Update manifest with CID
    manifest.cid = rootCid;

    // 4. Remote Pinning (Pinata Backup)
    try {
      const { pinToPinata, isPinataConfigured } = await import("./pinata.js");
      if (isPinataConfigured()) {
        console.log("📌 Pining to Pinata for persistence...");
        await pinToPinata(rootCid);
      }
    } catch {
      // Quiet fail for remote pin - local is primary
    }

    return { cid: rootCid, manifest };
  }

  /**
   * Install/Download a skill from IPFS by CID
   */
  async install(cid: string, alias?: string): Promise<string> {
    const targetDir = this.config.localSkillsDir || "./skills";
    console.log(`\n📥 Installing skill ${cid}...`);

    // Create temp or final directory
    // If alias is provided, use it as folder name. Otherwise use CID.
    const folderName = alias || cid;
    const installPath = path.join(targetDir, folderName);

    await mkdir(installPath, { recursive: true });

    // IPFS Get
    // This is a simplified version. For real robust implementation we need to handle recursive structures.
    // For now we assume a flat-ish structure or use 'get' command.

    // In kubo-rpc-client, .get returns an async generator of files
    for await (const file of this.ipfs.get(cid)) {
      // @ts-ignore
      const f = file as any;
      // f.path includes the CID prefix, we want to strip it relative to installPath
      // e.g. QmHash/index.js -> index.js
      const relativePath = f.path.replace(new RegExp(`^${cid}/?`), "");

      if (!relativePath) continue; // Skip root folder itself if it matches

      const fullPath = path.join(installPath, relativePath);

      if (f.type === "dir") {
        await mkdir(fullPath, { recursive: true });
      } else if (f.type === "file") {
        // Collect content
        const chunks = [];
        // @ts-ignore - kubo-rpc-client types are tricky
        for await (const chunk of f.content) {
          chunks.push(chunk);
        }
        await writeFile(fullPath, Buffer.concat(chunks));
      }
    }

    console.log(`✅ Installed to ${installPath}`);
    return installPath;
  }

  async listPinned(): Promise<string[]> {
    const pins = [];
    for await (const pin of this.ipfs.pin.ls()) {
      pins.push(pin.cid.toString());
    }
    return pins;
  }

  // --- Dashboard Support Methods ---

  /**
   * Get the global index (Mock/Local for Phase 1)
   */
  async getIndex(): Promise<NeoSkillsIndex> {
    // In Phase 1, we don't have a global decentralized index contract yet.
    // We will generate an index based on LOCALLY installed skills for the dashboard.
    const localSkills = await this.list();

    const skillsMap: Record<string, any> = {};

    for (const skill of localSkills) {
      skillsMap[skill.name] = {
        latest: skill.version,
        versions: {
          [skill.version]: skill.cid || "local-dev",
        },
      };
    }

    return {
      updatedAt: new Date().toISOString(),
      skills: skillsMap,
    };
  }

  async getIndexCID(): Promise<string | null> {
    return "QmMockIndexHashPhase1"; // Placeholder
  }

  /**
   * Create a new empty index on IPFS
   */
  async createIndex(): Promise<string> {
    const emptyIndex: NeoSkillsIndex = {
      updatedAt: new Date().toISOString(),
      skills: {},
    };

    const content = JSON.stringify(emptyIndex, null, 2);
    const result = await this.ipfs.add({
      path: "index.json",
      content: content,
    });

    return result.cid.toString();
  }

  /**
   * List installed skills by scanning local ./skills directory
   */
  async list(): Promise<(SkillManifest & { id: string; cid: string; category: string })[]> {
    const skillsDir = this.config.localSkillsDir || "./skills";
    const results = [];

    try {
      // Check if dir exists
      if (!fs.existsSync(skillsDir)) return [];

      const entries = await fs.promises.readdir(skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const manifestPath = path.join(skillsDir, entry.name, "skill.json");
          if (fs.existsSync(manifestPath)) {
            try {
              const content = await readFile(manifestPath, "utf-8");
              const manifest = JSON.parse(content);
              results.push({
                ...manifest,
                id: entry.name, // Folder name acts as ID locally
                cid: manifest.cid || "local",
                category: manifest.category || "uncategorized",
              });
            } catch (e) {
              console.warn(`Failed to parse ${manifestPath}`, e);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error listing skills:", e);
    }

    return results;
  }
}

// Factory
export const createNeoRegistry = (config?: NeoRegistryConfig) => new NeoSkillsRegistry(config);
export const createNeoSkillsRegistry = createNeoRegistry; // Alias for SDK compatibility
