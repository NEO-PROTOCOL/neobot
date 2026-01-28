import { runShellSkill } from "../../infra/runner/run-shell-skill.js";
import { sendTelegramNotification } from "../../infra/notifiers/telegram.js";

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
      channel: "unknown",
      actor: "cron", // Critical: Identifying as system-driven
    });

    if (result.ok) {
      console.log("✅ Relatório Diário gravado no Ledger.");

      // Notify via Telegram
      const reportDate = new Date().toLocaleDateString("pt-BR");
      const telegramMessage = `📊 *Relatório Diário de Operações - ${reportDate}*\n\n${result.stdout.trim()}`;
      await sendTelegramNotification(telegramMessage);
    } else {
      console.error("❌ Falha no Relatório Diário de Operações.");
      await sendTelegramNotification("🚨 *ERRO: Falha no Relatório Diário de Operações*");
    }
  },
};
