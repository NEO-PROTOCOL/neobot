import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

import { appendLedgerEvent, createEventId, type LedgerRisk } from "../ledger/ledger.js";

export type RunShellSkillParams = {
  skill: string;
  scriptPath: string;
  args?: string[];
  risk?: LedgerRisk;
  channel?: "cli" | "tui" | "telegram" | "discord" | "scheduler" | "cron" | "unknown";
  actor?: "user" | "agent" | "cron";
};

export type RunShellSkillResult = {
  ok: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  duration_ms: number;
  eventId: string;
};

function existsOrThrow(p: string) {
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${p}`);
}

export async function runShellSkill(params: RunShellSkillParams): Promise<RunShellSkillResult> {
  const { skill, scriptPath, args = [], risk = "low", channel = "cli", actor = "user" } = params;

  const resolved = path.resolve(process.cwd(), scriptPath);
  existsOrThrow(resolved);

  const eventId = createEventId("evt");
  const startedAt = Date.now();

  let stdout = "";
  let stderr = "";

  return await new Promise((resolve) => {
    const child = spawn("bash", [resolved, ...args], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      const duration_ms = Date.now() - startedAt;
      const ok = code === 0;

      appendLedgerEvent({
        id: eventId,
        ts: new Date().toISOString(),
        actor,
        channel,
        skill,
        intent: `run ${skill}`,
        status: ok ? "success" : "error",
        duration_ms,
        risk,
        error: ok ? null : stderr || `Exit code ${code}`,
        agent_id: "core",
        parent_event_id: null,
      });

      resolve({
        ok,
        exitCode: code,
        stdout,
        stderr,
        duration_ms,
        eventId,
      });
    });
  });
}
