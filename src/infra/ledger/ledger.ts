import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";

export type LedgerRisk = "low" | "high";
export type LedgerStatus = "success" | "error";

export type LedgerEvent = {
  id: string;
  ts: string;

  actor: "user" | "agent" | "cron";
  channel: "cli" | "tui" | "telegram" | "discord" | "unknown";

  skill: string;
  intent?: string;

  status: LedgerStatus;
  duration_ms: number;
  risk: LedgerRisk;

  agent_id?: string;
  parent_event_id?: string | null;

  error?: string | null;
};

function defaultStateDir(): string {
  // Use the standard moltbot state directory usually at ~/.clawdbot/
  // But for simple local consistency we can check environment or default
  return path.join(os.homedir(), ".clawdbot", "state");
}

function ledgerPath(): string {
  const dir = defaultStateDir();
  // Ensure the directory exists when retrieving path
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "ledger.jsonl");
}

export function createEventId(prefix = "evt"): string {
  const rand = crypto.randomBytes(6).toString("hex");
  const ts = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  return `${prefix}_${ts}_${rand}`;
}

export function appendLedgerEvent(evt: LedgerEvent): void {
  const file = ledgerPath();
  const line = JSON.stringify(evt) + "\n";
  fs.appendFileSync(file, line, { encoding: "utf8" });
}

export function getLedgerFilePath(): string {
  return ledgerPath();
}
