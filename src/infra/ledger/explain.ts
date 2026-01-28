import fs from "node:fs";
import { getLedgerFilePath } from "./ledger.js";

export async function explainEvent(eventId: string) {
  const ledgerPath = getLedgerFilePath();
  if (!fs.existsSync(ledgerPath)) {
    return "❌ Arquivo Ledger não encontrado.";
  }

  const lines = fs
    .readFileSync(ledgerPath, "utf-8")
    .split("\n")
    .filter((l) => l.trim() !== "");
  const event = lines
    .map((line) => JSON.parse(line))
    .find((e) => e.id === eventId || e.ts === eventId);

  if (!event) {
    return `❌ Evento ${eventId} não encontrado no Ledger.`;
  }

  const date = new Date(event.ts).toLocaleString("pt-BR");
  const actor = event.actor === "cron" ? "🤖 Sistema (Agendador)" : "👤 Usuário";

  let explanation = `🔍 **Explicação do Evento: ${eventId}**\n`;
  explanation += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  explanation += `📅 **Data:** ${date}\n`;
  explanation += `🎭 **Ator:** ${actor}\n`;
  explanation += `🛠️ **Skill:** \`${event.skill || "n/a"}\`\n`;
  explanation += `🎯 **Intenção:** ${event.intent || "Não especificada"}\n`;
  explanation += `🚦 **Status:** ${event.status === "success" ? "✅ Sucesso" : "❌ " + (event.status || "Erro")}\n`;
  explanation += `⚠️ **Risco:** ${event.risk || "desconhecido"}\n`;

  if (event.data) {
    explanation += `\n📦 **Dados:** \n${JSON.stringify(event.data, null, 2)}\n`;
  }

  if (event.error) {
    explanation += `\n🚨 **Erro Detalhado:** ${event.error}\n`;
  }

  return explanation;
}
