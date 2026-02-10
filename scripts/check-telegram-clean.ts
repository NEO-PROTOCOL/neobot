import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const FORBIDDEN_PATHS = [
  "src/gateway/telegram",
  "src/infra/notifiers/telegram.ts",
  "src/telegram",
  "extensions/telegram",
];

const FORBIDDEN_CONTENT = ["node-telegram-bot-api", "telegraf", "telegram-bot-api"];

let hasError = false;

console.log("🛡️  Scanning for Telegram contamination...");

// Check paths
for (const p of FORBIDDEN_PATHS) {
  if (fs.existsSync(path.join(ROOT, p))) {
    console.error(`❌ FOUND FORBIDDEN PATH: ${p} (Must be removed)`);
    hasError = true;
  }
}

// Check dependencies in package.json
const packageJsonPath = path.join(ROOT, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const content of FORBIDDEN_CONTENT) {
    if (deps[content]) {
      console.error(`❌ FOUND FORBIDDEN DEPENDENCY: ${content}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error("\n🚨 SYSTEM COMPROMISED: Telegram components detected!");
  process.exit(1);
} else {
  console.log("✅ System is clean. No Telegram traces found.");
}
