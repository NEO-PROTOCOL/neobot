
import type { Model, Api } from "@mariozechner/pi-ai";

/**
 * NEØ Adapter for Legacy PI-Coding-Agent Discovery
 * Replaces the defunct external dependency with a sovereign in-memory implementation.
 */

// --- Type Definitions ---

export interface AuthStorage {
    setRuntimeApiKey(provider: string, key: string): void;
    getApiKey(provider: string): string | null;
    load(): void;
    save(): void;
}

export interface ModelRegistry {
    find(provider: string, modelId: string): Model<Api> | null;
    getAll(): Model<Api>[];
    getAvailable(): Model<Api>[];
}

// --- Implementation ---

export const discoverAuthStorage = (_agentDir: string): AuthStorage => {
    // In-memory runtime storage for session keys
    const runtimeKeys = new Map<string, string>();

    return {
        setRuntimeApiKey: (provider: string, key: string) => {
            runtimeKeys.set(provider, key);
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
    };
};

export const discoverModels = (_auth: any, _agentDir: string): ModelRegistry => {
    return {
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
                // Extra fields to satisfy strict interfaces if needed, handled via 'as any' cast below
            } as unknown as Model<Api>;
        },
        getAll: () => [],
        getAvailable: () => []
    };
};
