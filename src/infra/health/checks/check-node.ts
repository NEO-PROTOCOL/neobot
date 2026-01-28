import type { HealthCheckResult } from "../types.js";

export async function checkNodeStatus(): Promise<HealthCheckResult> {
  return {
    key: "node_runtime",
    status: "ok",
    summary: `Node ${process.version} no sistema ${process.platform}`,
    details: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime_seconds: process.uptime(),
      memory_usage: process.memoryUsage(),
    },
  };
}
