
import type { Model, Api } from "@mariozechner/pi-ai";

/**
 * NEØ Adapter for Legacy PI-Coding-Agent Discovery
 * Replaces the defunct external dependency with a sovereign in-memory implementation.
 */

// --- Type Definitions ---

export interface AuthStorage {
    authPath: string;
    data: any;
    runtimeOverrides: any;
    setRuntimeApiKey(provider: string, key: string): void;
    removeRuntimeApiKey(provider: string): void;
    getApiKey(provider: string): string | null;
    load(): void;
    save(): void;
    [key: string]: any;
}

export interface ModelRegistry {
    authStorage: AuthStorage;
    modelsJsonPath: string;
    models: Model<Api>[];
    customProviderApiKeys: any;
    find(provider: string, modelId: string): Model<Api> | null;
    getAll(): Model<Api>[];
    getAvailable(): Model<Api>[];
    [key: string]: any;
}

// --- Implementation ---

export const discoverAuthStorage = (agentDir: string): AuthStorage => {
    // In-memory runtime storage for session keys
    const runtimeKeys = new Map<string, string>();

    return {
        authPath: agentDir,
        data: {},
        runtimeOverrides: {},
        setRuntimeApiKey: (provider: string, key: string) => {
            runtimeKeys.set(provider, key);
        },
        removeRuntimeApiKey: (provider: string) => {
            runtimeKeys.delete(provider);
        },
        getApiKey: (provider: string) => {
            // Priority: Runtime > Environment Variable
            if (runtimeKeys.has(provider)) {
                return runtimeKeys.get(provider)!;
            }
            // Fallback to Standard/Upper standard env vars
            const envKey = process.env[`${provider.toUpperCase()}_API_KEY`];
            return envKey || null;
        },
        load: () => {
            // No-op: Sovereign node relies on ENV injects for persistence, or runtime derived keys.
        },
        save: () => {
            // No-op: We do not persist keys to disk in this adapter for security (read-only filesystem compat).
        }
    } as AuthStorage;
};

export const discoverModels = (auth: any, agentDir: string): ModelRegistry => {
    return {
        authStorage: auth,
        modelsJsonPath: agentDir,
        models: [],
        customProviderApiKeys: {},
        find: (provider: string, modelId: string): Model<Api> | null => {
            // Dynamic Model Construction on Request
            return {
                id: modelId,
                provider: provider,
                name: modelId,
                input: ["text", "image"], // Assume multimodal capability for generic adapter
                api: undefined as any, // API instance is handled by the caller usually
                contextWindow: 128000, // Defatult safe high context
                maxTokens: 4096,
                cost: { input: 0, output: 0 },
                description: "Sovereign Adapter Model",
            } as any;
        },
        getAll: () => [],
        getAvailable: () => []
    } as ModelRegistry;
};
