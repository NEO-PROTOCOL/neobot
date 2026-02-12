import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { loadCronStore, saveCronStore, resolveCronStorePath } from "../../../src/cron/store.js";
import type { CronJob, CronPayload } from "../../../src/cron/types.js";
import { loadDotEnv } from "../../../src/infra/dotenv.js";

loadDotEnv();

async function main() {
    const args = process.argv.slice(2);
    const cmd = args[0];

    const storePath = resolveCronStorePath();

    if (cmd === "add") {
        const nameIndex = args.indexOf("--name");
        const whenIndex = args.indexOf("--when");
        const commandIndex = args.indexOf("--command");
        const toIndex = args.indexOf("--to");
        const msgIndex = args.indexOf("--message");

        if (nameIndex === -1 || whenIndex === -1 || commandIndex === -1) {
            console.error("❌ Mínimo necessário: --name, --when, --command");
            process.exit(1);
        }

        const name = args[nameIndex + 1];
        const when = args[whenIndex + 1];
        const command = args[commandIndex + 1];
        const to = toIndex !== -1 ? args[toIndex + 1] : undefined;
        const message = msgIndex !== -1 ? args[msgIndex + 1] : undefined;

        const store = await loadCronStore(storePath);

        // Basic "when" parsing for "in X minutes"
        let schedule: any;
        const now = Date.now();
        const inMinMatch = when.match(/in (\d+) minutes?/i);
        const emMinMatch = when.match(/em (\d+) minutos?/i);

        if (inMinMatch || emMinMatch) {
            const mins = parseInt(inMinMatch ? inMinMatch[1] : emMinMatch![1], 10);
            schedule = { kind: "at", atMs: now + mins * 60 * 1000 };
        } else if (when.includes("*")) {
            schedule = { kind: "cron", expr: when };
        } else {
            // Fallback: try to parse as ISO date or timestamp
            const date = new Date(when);
            if (!isNaN(date.getTime())) {
                schedule = { kind: "at", atMs: date.getTime() };
            } else {
                console.error(`❌ Não consegui entender o horário: ${when}`);
                process.exit(1);
            }
        }

        const payload: CronPayload = {
            kind: "agentTurn",
            message: message || command,
            channel: to ? "telegram" : "cli",
            to: to,
            deliver: true
        };

        const newJob: CronJob = {
            id: crypto.randomUUID(),
            name,
            enabled: true,
            deleteAfterRun: schedule.kind === "at",
            createdAtMs: now,
            updatedAtMs: now,
            schedule,
            sessionTarget: "isolated",
            wakeMode: "now",
            payload,
            state: {}
        };

        store.jobs.push(newJob);
        await saveCronStore(storePath, store);

        console.log(`✅ Tarefa agendada: "${name}" para ${new Date(schedule.atMs || 0).toLocaleString()}`);
        process.exit(0);
    }

    if (cmd === "list") {
        const store = await loadCronStore(storePath);
        console.log(`📋 ${store.jobs.length} tarefas agendadas:`);
        store.jobs.forEach(j => {
            console.log(`- [${j.id.slice(0, 8)}] ${j.name}: ${JSON.stringify(j.schedule)}`);
        });
        process.exit(0);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
