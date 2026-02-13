import fs from "node:fs";
import path from "node:path";

// Type definition matching config/neobot.runtime.json
export interface NeobotRuntimeConfig {
  channels: {
    [key: string]: { enabled: boolean };
  };
  executors: {
    [key: string]: { enabled: boolean; identity?: string };
  };
  social_browser_automation: {
    enabled: boolean;
    targets: {
      [key: string]: boolean;
    };
    require_confirmation: boolean;
  };
}

const DEFAULT_CONFIG: NeobotRuntimeConfig = {
  channels: {
    whatsapp: { enabled: true },
  },
  executors: {
    github_mcp: { enabled: true },
    brave_mcp: { enabled: true },
    docker: { enabled: true },
    ipfs_local: { enabled: true },
  },
  social_browser_automation: {
    enabled: false, // Default off for safety
    targets: {},
    require_confirmation: true,
  },
};

export function loadRuntimeConfig(): NeobotRuntimeConfig {
  const configPath = path.resolve(process.cwd(), "config/neobot.runtime.json");

  if (!fs.existsSync(configPath)) {
    // Fallback if missing, but preferably should warn
    return DEFAULT_CONFIG;
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as NeobotRuntimeConfig;
  } catch (err) {
    console.error(
      `Failed to load runtime config: ${err instanceof Error ? err.message : String(err)}`,
    );
    return DEFAULT_CONFIG;
  }
}

export function assertChannelEnabled(channelId: string, cfg = loadRuntimeConfig()): void {
  const channel = cfg.channels[channelId];
  if (!channel || !channel.enabled) {
    throw new Error(`Execution Blocked: Channel '${channelId}' is disabled in runtime config.`);
  }
}

export function assertExecutorEnabled(executorId: string, cfg = loadRuntimeConfig()): void {
  const executor = cfg.executors[executorId];
  if (!executor || !executor.enabled) {
    throw new Error(`Execution Blocked: Executor '${executorId}' is disabled in runtime config.`);
  }
}

export function assertSocialEnabled(targetPlatform?: string, cfg = loadRuntimeConfig()): void {
  if (!cfg.social_browser_automation.enabled) {
    throw new Error(`Execution Blocked: Social browser automation is disabled globally.`);
  }

  if (targetPlatform) {
    const targetEnabled = cfg.social_browser_automation.targets[targetPlatform];
    if (!targetEnabled) {
      throw new Error(`Execution Blocked: Social target '${targetPlatform}' is disabled.`);
    }
  }
}

export function requiresConfirmation(
  skillType: "social" | "high_risk",
  cfg = loadRuntimeConfig(),
): boolean {
  if (skillType === "social") {
    return cfg.social_browser_automation.require_confirmation;
  }
  return false;
}
