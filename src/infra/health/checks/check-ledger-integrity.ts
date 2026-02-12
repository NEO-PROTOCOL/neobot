import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { getLedgerFilePath } from "../../ledger/ledger.js";
import type { HealthCheckResult } from "../types.js";

const CHECKPOINT_FILE = ".ledger.checkpoint.json";

interface LedgerCheckpoint {
  ledger_path: string;
  last_line: number;
  last_hash: string;
  ts: string;
}

export async function checkLedgerIntegrity(doRepair: boolean = false): Promise<HealthCheckResult> {
  const ledgerPath = getLedgerFilePath();
  const stateDir = path.dirname(ledgerPath);
  const checkpointPath = path.join(stateDir, CHECKPOINT_FILE);

  let repairExecuted = false;
  let repairLog = "";

  if (!fs.existsSync(ledgerPath)) {
    return {
      key: "ledger_integrity",
      status: "warn",
      summary: "Arquivo do Ledger ausente",
      recommendation: "Execute qualquer skill para inicializar o ledger.",
    };
  }

  try {
    const rawContent = fs.readFileSync(ledgerPath, "utf-8");
    const lines = rawContent.split("\n").filter((l) => l.trim() !== "");

    let currentHash = "0".repeat(64); // Genesis hash
    let lineCount = 0;

    for (const line of lines) {
      const hash = crypto.createHash("sha256");
      hash.update(currentHash + "\n" + line);
      currentHash = hash.digest("hex");
      lineCount++;
    }

    // Check against checkpoint
    let status: "ok" | "fail" = "ok";
    let summary = `Verificados ${lineCount} eventos. Integridade da corrente intacta.`;

    if (fs.existsSync(checkpointPath)) {
      const checkpoint: LedgerCheckpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf-8"));
      if (lineCount < checkpoint.last_line) {
        status = "fail";
        summary = `O Ledger possui menos eventos (${lineCount}) do que o último checkpoint (${checkpoint.last_line}). Possível truncamento ou violação.`;
      } else if (lineCount === checkpoint.last_line && currentHash !== checkpoint.last_hash) {
        status = "fail";
        summary = "Ledger modificado. Incoerência de hash no checkpoint.";
      }
    }

    // Repair logic
    if (status === "fail" && doRepair) {
      repairExecuted = true;
      repairLog = `Checkpoint antigo ignorado e sobrescrito para a linha ${lineCount}.`;
      status = "ok";
      summary = `Integridade resetada para o estado atual (${lineCount} eventos).`;
    }

    if (status === "ok") {
      const newCheckpoint: LedgerCheckpoint = {
        ledger_path: ledgerPath,
        last_line: lineCount,
        last_hash: currentHash,
        ts: new Date().toISOString(),
      };
      fs.writeFileSync(checkpointPath, JSON.stringify(newCheckpoint, null, 2));
    }

    return {
      key: "ledger_integrity",
      status: status,
      summary: summary,
      details: {
        event_count: lineCount,
        last_hash: currentHash,
      },
      repair_executed: repairExecuted,
      repair_log: repairLog,
    };
  } catch (error: any) {
    return {
      key: "ledger_integrity",
      status: "fail",
      summary: `Falha ao verificar ledger: ${error.message}`,
      recommendation: "Inspecione o arquivo ledger.jsonl para identificar corrupção.",
    };
  }
}
