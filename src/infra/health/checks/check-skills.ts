import fs from "node:fs";
import { getLedgerFilePath } from "../../ledger/ledger.js";
import type { HealthCheckResult } from "../types.js";

export async function checkSkillsStatus(sinceHours: number = 24): Promise<HealthCheckResult> {
  const ledgerPath = getLedgerFilePath();

  if (!fs.existsSync(ledgerPath)) {
    return {
      key: "skills_status",
      status: "ok",
      summary: "Nenhuma skill executada ainda.",
    };
  }

  try {
    const rawContent = fs.readFileSync(ledgerPath, "utf-8");
    const lines = rawContent.split("\n").filter((l) => l.trim() !== "");
    const now = Date.now();
    const threshold = now - sinceHours * 60 * 60 * 1000;

    const periodEvents = lines
      .map((l) => JSON.parse(l))
      .filter((e) => {
        const ts = new Date(e.ts).getTime();
        return ts >= threshold;
      });

    if (periodEvents.length === 0) {
      return {
        key: "skills_status",
        status: "ok",
        summary: `Nenhuma skill executada nas últimas ${sinceHours}h.`,
      };
    }

    const stats: Record<string, { runs: number; success: number; error: number; blocked: number }> =
      {};
    let totalFails = 0;
    let totalBlocked = 0;

    for (const event of periodEvents) {
      const skill = event.skill || "unknown";
      if (!stats[skill]) {
        stats[skill] = { runs: 0, success: 0, error: 0, blocked: 0 };
      }

      stats[skill].runs++;
      if (event.status === "success") stats[skill].success++;
      else if (event.status === "error" || event.error) {
        stats[skill].error++;
        totalFails++;
      } else if (event.status === "blocked") {
        stats[skill].blocked++;
        totalBlocked++;
      }
    }

    const status: "ok" | "warn" | "fail" =
      totalFails > 0 ? "fail" : totalBlocked > 0 ? "warn" : "ok";
    const summary = `${periodEvents.length} execuções | ${totalFails} falhas | ${totalBlocked} bloqueios (últimas ${sinceHours}h)`;

    return {
      key: "skills_status",
      status,
      summary,
      details: stats,
    };
  } catch (error: any) {
    return {
      key: "skills_status",
      status: "fail",
      summary: `Falha ao analisar skills: ${error.message}`,
    };
  }
}
