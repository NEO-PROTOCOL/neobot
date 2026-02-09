import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { MerkleTree } from "./merkle.js";

export type LedgerRisk = "low" | "high";
export type LedgerStatus = "success" | "error";

export type LedgerEvent = {
  id: string;
  ts: string;

  actor: "user" | "agent" | "cron";
  channel: "cli" | "tui" | "scheduler" | "cron" | "unknown";

  skill: string;
  intent?: string;

  status: LedgerStatus;
  duration_ms: number;
  risk: LedgerRisk;

  agent_id?: string;
  parent_event_id?: string | null;

  error?: string | null;
  checkpoint?: string; // root of the Merkle Tree for this batch
  tool_hash?: string; // SHA-256 hash of the tool definition
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

let eventBatch: string[] = [];
const BATCH_SIZE = 10;

export function appendLedgerEvent(evt: LedgerEvent): void {
  const file = ledgerPath();
  const line = JSON.stringify(evt) + "\n";
  fs.appendFileSync(file, line, { encoding: "utf8" });

  // Add hash of event to the current batch for PoE
  const eventHash = crypto.createHash("sha256").update(line).digest("hex");
  eventBatch.push(eventHash);

  if (eventBatch.length >= BATCH_SIZE) {
    appendCheckpoint();
  }
}

export function appendCheckpoint(): void {
  if (eventBatch.length === 0) return;

  const tree = new MerkleTree(eventBatch);
  const root = tree.getRoot();

  const checkpoint: LedgerEvent = {
    id: createEventId("chk"),
    ts: new Date().toISOString(),
    actor: "cron",
    channel: "unknown",
    skill: "security/poe",
    status: "success",
    duration_ms: 0,
    risk: "high",
    checkpoint: root,
  };

  const file = ledgerPath();
  fs.appendFileSync(file, JSON.stringify(checkpoint) + "\n", { encoding: "utf8" });
  eventBatch = []; // Reset batch
}

export function getLedgerFilePath(): string {
  return ledgerPath();
}
