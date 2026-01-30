import { spawnSync } from "node:child_process";

const major = Number.parseInt(process.versions?.node?.split(".")[0] ?? "0", 10);
if (major < 22) {
  console.error("Este projeto exige Node.js >= 22. Versão atual: " + (process.version || "?") + ".");
  console.error("Na pasta do projeto, rode: nvm use");
  console.error("(ou defina Node 22 como padrão: nvm alias default 22)");
  process.exit(1);
}

const args = process.argv.slice(2);
const isWin = process.platform === "win32";
const pnpmCmd = isWin ? "pnpm.cmd" : "pnpm";

const r = spawnSync(pnpmCmd, ["tsx", "src/cli/neobot.ts", ...args], {
    stdio: "inherit",
    shell: true
});

process.exit(r.status ?? 1);
