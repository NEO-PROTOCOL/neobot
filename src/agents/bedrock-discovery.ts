import type { BedrockDiscoveryConfig, ModelDefinitionConfig } from "../config/types.js";

// Stubbed implementation to remove dependency on @aws-sdk/client-bedrock

export function resetBedrockDiscoveryCacheForTest(): void {
  // no-op
}

export async function discoverBedrockModels(params: {
  region: string;
  config?: BedrockDiscoveryConfig;
  now?: () => number;
  clientFactory?: any;
}): Promise<ModelDefinitionConfig[]> {
  console.warn("[bedrock-discovery] AWS Bedrock discovery is disabled in this environment.");
  return [];
}
