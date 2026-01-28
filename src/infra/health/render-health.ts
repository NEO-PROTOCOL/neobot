import type { GlobalHealthReport, HealthCheckResult } from "./types.js";
import { toYaml } from "./yaml.js";

export type HealthOutputFormat = "chat" | "yaml" | "json";

function icon(status: string): string {
  if (status === "ok") return "✅";
  if (status === "warn") return "⚠️";
  return "❌";
}

function formatKeyPtbr(key: string): string {
  return key.replaceAll("_", " ");
}

export function renderHealth(
  report: GlobalHealthReport,
  format: HealthOutputFormat,
  full: boolean,
): string {
  if (format === "json") {
    return JSON.stringify(report, null, 2);
  }

  if (format === "yaml") {
    return toYaml(report);
  }

  // chat (human)
  const lines: string[] = [];
  const statusIcon = icon(report.overall_status);
  lines.push(`SAÚDE DO SISTEMA NEOBOT ${statusIcon}`);
  lines.push(`Horário: ${report.ts}`);
  lines.push("----------------------------------------------------------------");

  for (const c of report.checks) {
    lines.push(`${icon(c.status)} ${formatKeyPtbr(c.key)}: ${c.summary}`);

    if (full) {
      if (c.recommendation) {
        lines.push(`   👉 Recomendação: ${c.recommendation}`);
      }
      if (c.details && Object.keys(c.details).length > 0) {
        // show details as mini-yaml (readable)
        const detailsYaml = toYaml(c.details);
        lines.push(`   Detalhes:`);
        lines.push(
          detailsYaml
            .split("\n")
            .map((l) => `   ${l}`)
            .join("\n"),
        );
      }
    }
  }

  lines.push("----------------------------------------------------------------");
  return lines.join("\n");
}
