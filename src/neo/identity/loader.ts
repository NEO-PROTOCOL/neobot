import { config } from "dotenv";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { MioIdentityManager, type NeoIdentity } from "./mio-system.js";
import { NEO_IDENTITY_TEMPLATES } from "./registry.js";

// Carregar variáveis de ambiente (focando no path absoluto para evitar problemas de permissão/contexto)
const rootDir = process.cwd();
config({ path: path.join(rootDir, ".env") });
config({ path: path.join(rootDir, ".neo-identities", ".env") });

/**
 * Mapeamento de IDs para Variáveis de Ambiente
 */
const ENV_MAP: Record<string, string> = {
    "mio-core": "NEO_CORE_PRIVATE_KEY",
    "mio-gateway": "NEO_GATEWAY_PRIVATE_KEY",
    "mio-skills": "NEO_SKILLS_PRIVATE_KEY",
    "mio-factory": "NEO_FACTORY_PRIVATE_KEY",
    "mio-flowpay": "NEO_FLOWPAY_PRIVATE_KEY",
    "mio-asi1": "NEO_ASI1_PRIVATE_KEY",
    "mio-telegram": "NEO_TELEGRAM_PRIVATE_KEY",
    "mio-whatsapp": "NEO_WHATSAPP_PRIVATE_KEY",
    "mio-ipfs": "NEO_IPFS_PRIVATE_KEY",
    "mio-warrior": "NEO_WARRIOR_PRIVATE_KEY",
};

export interface LoadedIdentity {
    identity: NeoIdentity;
    manager: MioIdentityManager;
}

/**
 * IdentityLoader - Carrega as identidades soberanas do protocolo
 */
export class IdentityLoader {
    private static instance: IdentityLoader;
    private loadedIdentities: Map<string, LoadedIdentity> = new Map();

    private constructor() { }

    public static getInstance(): IdentityLoader {
        if (!IdentityLoader.instance) {
            IdentityLoader.instance = new IdentityLoader();
        }
        return IdentityLoader.instance;
    }

    /**
     * Carrega todas as identidades configuradas no ambiente
     */
    public async loadAll(): Promise<number> {
        let count = 0;
        for (const template of NEO_IDENTITY_TEMPLATES) {
            const envVar = ENV_MAP[template.id];
            const privateKey = process.env[envVar];

            if (privateKey) {
                try {
                    const manager = new MioIdentityManager(privateKey);

                    // Tentar carregar o JSON da identidade se existir
                    const jsonPath = path.join(".neo-identities", `${template.id}.json`);
                    let identity: NeoIdentity;

                    try {
                        const jsonContent = await fs.readFile(jsonPath, "utf-8");
                        identity = manager.fromJSON(jsonContent);
                    } catch {
                        // Se não houver JSON, criar uma nova (v0 do sistema)
                        identity = await manager.createIdentity(template.metadata, {
                            roles: [template.role],
                            permissions: template.permissions as any,
                        });
                    }

                    this.loadedIdentities.set(template.id, { identity, manager });
                    count++;
                } catch (error) {
                    console.error(`[MIO-LOADER] Failed to load identity ${template.id}:`, error);
                }
            }
        }
        return count;
    }

    /**
     * Retorna uma identidade carregada
     */
    public getIdentity(id: string): LoadedIdentity | undefined {
        return this.loadedIdentities.get(id);
    }

    /**
     * Retorna o Warrior (principal para logs e segurança)
     */
    public getWarrior(): LoadedIdentity | undefined {
        return this.getIdentity("mio-warrior");
    }

    /**
     * Assina um log ou mensagem com a identidade Warrior
     */
    public async signAsWarrior(message: string): Promise<string | undefined> {
        const warrior = this.getWarrior();
        if (!warrior) return undefined;
        return await warrior.manager.signMessage(message);
    }

    /**
     * Lista identidades carregadas
     */
    public listLoaded(): string[] {
        return Array.from(this.loadedIdentities.keys());
    }
}

export const identityLoader = IdentityLoader.getInstance();
