import { runShellSkill } from "../../infra/runner/run-shell-skill.js";
import { createHealthAnchor } from "../../infra/health/anchor.js";

export const dailyOpsStatusJob = {
  name: "daily-ops-status",
  schedule: "0 9 * * *", // 9:00 AM daily
  run: async () => {
    console.log("⏰ Iniciando Relatório Diário de Operações...");
    const result = await runShellSkill({
      skill: "ops-status",
      scriptPath: "skills/ops-status/scripts/report.sh",
      args: ["full"],
      risk: "low",
      channel: "scheduler",
      actor: "cron", // Critical: Identifying as system-driven
    });

    if (result.ok) {
      console.log("✅ Relatório Diário gravado no Ledger.");

      // Create Health Anchor
      const anchor = await createHealthAnchor();
      if (anchor) {
        console.log(`⚓ ÂNCORA DE SAÚDE: date=${anchor.date}, ledger_hash=${anchor.ledger_hash.substring(0, 16)}...`);
      }
    } else {
      console.error("❌ Falha no Relatório Diário de Operações.");
    }
  },
};
