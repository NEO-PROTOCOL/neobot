import path from "node:path";
import { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";

export { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";

function createAuthStorage(AuthStorageLike: unknown, storagePath: string) {
  const withFactory = AuthStorageLike as { create?: (path: string) => unknown };
  if (typeof withFactory.create === "function") {
    return withFactory.create(storagePath) as AuthStorage;
  }
  return new (AuthStorageLike as { new (path: string): unknown })(storagePath) as AuthStorage;
}

// Compatibility helpers for pi-coding-agent 0.50+ (discover* helpers removed).
export function discoverAuthStorage(agentDir: string): AuthStorage {
  return createAuthStorage(AuthStorage, path.join(agentDir, "auth.json"));
}

export function discoverModels(authStorage: AuthStorage, agentDir: string): ModelRegistry {
  return new ModelRegistry(authStorage, path.join(agentDir, "models.json"));
}
