import { registerLogTransport } from "../logging/logger.js";

let dashboardUrl: string | null =
  process.env.INTERNAL_DASHBOARD_URL || process.env.EXTERNAL_DASHBOARD_URL || null;

/**
 * Bridges Core logs to the Dashboard via HTTP POST.
 * Allows remote monitoring of the agent from the web UI.
 */
export function startDashboardLogBridge() {
  if (!dashboardUrl) return;

  // Ensure it ends with /api/logs
  const target = dashboardUrl.endsWith("/")
    ? `${dashboardUrl}api/logs`
    : `${dashboardUrl}/api/logs`;

  console.log(`[moltbot] Dashboard log bridge active -> ${target}`);

  registerLogTransport(async (logObj) => {
    try {
      // Avoid infinite loops (dashboard logs shouldn't trigger local logs that trigger bridge...)
      // But here we are in the Core repo, so it's fine.

      const payload = {
        type: typeof logObj["level"] === "string" ? logObj["level"] : "info",
        message: Array.isArray(logObj["_raw"])
          ? logObj["_raw"].join(" ")
          : typeof logObj["message"] === "string"
            ? logObj["message"]
            : "No message",
        timestamp:
          logObj["date"] instanceof Date
            ? (logObj["date"] as Date).toISOString()
            : new Date().toISOString(),
      };

      await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Quiet fail to avoid spamming the console if dashboard is down
    }
  });
}
