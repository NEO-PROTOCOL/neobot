import { runShellSkill } from "../../infra/runner/run-shell-skill.js";

export const dailyOpsStatusJob = {
  name: "daily-ops-status",
  schedule: "0 9 * * *", // 9:00 AM daily
  run: async () => {
    console.log("⏰ Starting Daily Ops Status Job...");
    const result = await runShellSkill({
      skill: "ops-status",
      scriptPath: "skills/ops-status/scripts/report.sh",
      args: ["full"],
      risk: "low",
      channel: "unknown",
      actor: "cron", // Critical: Identifying as system-driven
    });

    if (result.ok) {
      console.log("✅ Daily Ops Status recorded in Ledger.");
    } else {
      console.error("❌ Daily Ops Status Job failed.");
    }
  },
};
