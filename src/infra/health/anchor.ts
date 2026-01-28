import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getLedgerFilePath } from "../ledger/ledger.js";

export async function createHealthAnchor() {
  const ledgerPath = getLedgerFilePath();
  if (!fs.existsSync(ledgerPath)) return null;

  const stateDir = path.dirname(ledgerPath);
  const anchorsDir = path.join(stateDir, "anchors");
  if (!fs.existsSync(anchorsDir)) {
    fs.mkdirSync(anchorsDir, { recursive: true });
  }

  const rawContent = fs.readFileSync(ledgerPath, "utf-8");
  const lines = rawContent.split("\n").filter((l) => l.trim() !== "");
  const lastLine = lines.length;

  // Calculate cumulative hash
  let currentHash = "0".repeat(64);
  for (const line of lines) {
    const hash = crypto.createHash("sha256");
    hash.update(currentHash + "\n" + line);
    currentHash = hash.digest("hex");
  }

  const date = new Date().toISOString().split("T")[0];
  const anchorPath = path.join(anchorsDir, `anchor-${date}.json`);

  const anchor = {
    date,
    ledger_hash: currentHash,
    checkpoint_line: lastLine,
    ts: new Date().toISOString(),
  };

  fs.writeFileSync(anchorPath, JSON.stringify(anchor, null, 2));
  return anchor;
}
