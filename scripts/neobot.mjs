import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const isWin = process.platform === "win32";
const pnpmCmd = isWin ? "pnpm.cmd" : "pnpm";

const r = spawnSync(pnpmCmd, ["tsx", "src/cli/neobot.ts", ...args], {
    stdio: "inherit",
    shell: true
});

process.exit(r.status ?? 1);
