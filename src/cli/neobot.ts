import "dotenv/config";
import { runShellSkill } from "../infra/runner/run-shell-skill.js";
import { getLedgerFilePath } from "../infra/ledger/ledger.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadRuntimeConfig } from "../config/runtime-config.js";

function banner() {
  console.log(
    `
    ================================================================
    
       ░█████╗░░██████╗░███████╗███╗░░██╗████████╗  ███╗░░██╗███████╗░█████╗░
       ██╔══██╗██╔════╝░██╔════╝████╗░██║╚══██╔══╝  ████╗░██║██╔════╝██╔══██╗
       ███████║██║░░██╗░█████╗░░██╔██╗██║░░░██║░░░  ██╔██╗██║█████╗░░██║░░██║
       ██╔══██║██║░░╚██╗██╔══╝░░██║╚████║░░░██║░░░  ██║╚████║██╔══╝░░██║░░██║
       ██║░░██║╚██████╔╝███████╗██║░╚███║░░░██║░░░  ██║░╚███║███████╗╚█████╔╝
       ╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚══╝░░░╚═╝░░░  ╚═╝░░╚══╝╚══════╝░╚════╝░
    
                    ◆ NEO PROTOCOL v1.0 ◆
                  ▶ Independent AI Framework ◀
    
    ================================================================
`.trim(),
  );
}

function usage() {
  banner();
  console.log(
    `
Usage:
  neobot run <skill> [args...]       Executar uma skill
  neobot whoami                      Verificar identidade atual
  neobot config show                 Mostrar configuração ativa
  neobot ledger path                 Ver caminho do Ledger
  neobot ledger tail [n]             Ver últimas entradas do Ledger
  neobot cron list                   Listar tarefas agendadas
  neobot cron run <job>              Executar tarefa manualmente
  neobot cron start                  Iniciar o agendador (scheduler)
  neobot health [--full] [--json|--yaml|--chat]    Diagnóstico de saúde do sistema
  neobot explain <id>                Explica um evento do ledger em PT-BR

Exemplos:
  pnpm neobot run ops-status
  pnpm neobot whoami
  pnpm neobot health
  pnpm neobot explain 2026-01-27T23:58:24.000Z
  pnpm neobot cron list
`.trim(),
  );
}

async function main() {
  const [, , cmd, subcmd, ...rest] = process.argv;

  if (!cmd) {
    usage();
    process.exit(0);
  }

  if (cmd === "health") {
    const { runHealthCheck } = await import("../infra/health/health.js");
    const { renderHealth } = await import("../infra/health/render-health.js");
    const allArgs = [subcmd, ...rest];

    const isJson = allArgs.includes("--json");
    const isYaml = allArgs.includes("--yaml");
    const isChat = allArgs.includes("--chat") || (!isJson && !isYaml);

    const format = isJson ? "json" : isYaml ? "yaml" : "chat";
    const isFull = allArgs.includes("--full");
    const sinceIdx = allArgs.indexOf("--since");
    const sinceHours = sinceIdx !== -1 ? parseInt(allArgs[sinceIdx + 1]) || 24 : 24;

    const report = await runHealthCheck({ sinceHours });
    console.log(renderHealth(report, format, isFull));

    process.exit(report.overall_status === "fail" ? 1 : 0);
  }

  if (cmd === "explain") {
    const { explainEvent } = await import("../infra/ledger/explain.js");
    const eventId = subcmd;
    if (!eventId) {
      console.error("❌ Por favor, forneça o ID do evento (timestamp).");
      process.exit(1);
    }
    const explanation = await explainEvent(eventId);
    console.log(explanation);
    process.exit(0);
  }

  if (cmd === "cron") {
    const { jobs, startScheduler } = await import("../infra/scheduler/scheduler.js");

    if (subcmd === "list") {
      console.log("📋 Tarefas Agendadas:");
      jobs.forEach((j) => console.log(`- ${j.name}: ${j.schedule}`));
      process.exit(0);
    }

    if (subcmd === "run") {
      const jobName = rest[0];
      const job = jobs.find((j) => j.name === jobName);
      if (!job) {
        console.error(`❌ Tarefa não encontrada: ${jobName}`);
        process.exit(1);
      }
      await job.run();
      process.exit(0);
    }

    if (subcmd === "start") {
      startScheduler();
      // Keep process alive
      process.stdin.resume();
      return;
    }

    usage();
    process.exit(1);
  }

  if (cmd === "whoami") {
    const cfg = loadRuntimeConfig();
    const user = os.userInfo();
    console.log(
      JSON.stringify(
        {
          actor: "user",
          channel: "cli",
          os_user: user.username,
          homedir: os.homedir(),
          cwd: process.cwd(),
          node: process.version,
          runtime_config: path.resolve(process.cwd(), "config/neobot.runtime.json"),
          enabled_channels: Object.entries(cfg.channels ?? {})
            .filter(([, v]) => v?.enabled === true)
            .map(([k]) => k),
          enabled_executors: Object.entries(cfg.executors ?? {})
            .filter(([, v]) => v?.enabled === true)
            .map(([k]) => k),
          social_enabled: cfg.social_browser_automation?.enabled === true,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  if (cmd === "config") {
    const action = subcmd;
    if (action === "show") {
      const cfg = loadRuntimeConfig();
      console.log(JSON.stringify(cfg, null, 2));
      process.exit(0);
    }
    usage();
    process.exit(1);
  }

  if (cmd === "ledger") {
    if (subcmd === "path") {
      console.log(getLedgerFilePath());
      process.exit(0);
    }

    if (subcmd === "tail") {
      const nRaw = rest[0] ?? "20";
      const n = Math.max(1, Math.min(200, Number(nRaw) || 20));
      const p = getLedgerFilePath();
      if (!fs.existsSync(p)) {
        console.error(`Ledger file not found: ${p}`);
        process.exit(1);
      }
      const lines = fs.readFileSync(p, "utf8").trim().split("\n").filter(Boolean);
      const last = lines.slice(-n);
      console.log(last.join("\n"));
      process.exit(0);
    }

    usage();
    process.exit(1);
  }

  if (cmd === "run") {
    const skill = subcmd;
    if (!skill) {
      usage();
      process.exit(1);
    }

    if (skill === "ops-status") {
      // load runtime config early (gatekeeper)
      loadRuntimeConfig();
      const { assertChannelEnabled, assertExecutorEnabled, requiresConfirmation } =
        await import("../config/runtime-config.js");
      const readline = await import("readline-sync");

      const argsArray = rest;
      if (argsArray.includes("--confirm-required")) {
        const answer = readline.question("⚠️  Confirmation required. Type 'CONFIRM' to proceed: ");
        if (answer !== "CONFIRM") {
          console.error("❌ Aborted by user.");
          process.exit(1);
        }
      }

      const res = await runShellSkill({
        skill: "ops-status",
        scriptPath: "skills/ops-status/scripts/report.sh",
        args: rest,
        risk: "low",
        channel: "cli",
        actor: "user",
      });

      console.log(res.stdout.trim());
      if (!res.ok) {
        console.error(res.stderr.trim());
        console.error(`\n[ledger event] ${res.eventId}`);
        process.exit(1);
      }

      console.log(`\n[ledger event] ${res.eventId}`);
      process.exit(0);
    }

    if (skill === "social-test") {
      const { assertSocialEnabled, requiresConfirmation } =
        await import("../config/runtime-config.js");
      const { appendLedgerEvent, createEventId } = await import("../infra/ledger/ledger.js");
      const readline = await import("readline-sync");

      try {
        // 1. Policy Gate: Check if enabled
        assertSocialEnabled("x");

        // 2. Policy Gate: Check confirmation
        if (requiresConfirmation("social")) {
          if (!rest.includes("--yes")) {
            // In a real CLI we might prompt. For this test automation we error if flag missing.
            // We can simulate the user interaction if running interactively, but here:
            console.error("⚠️  Confirmation required by policy. Use --yes to proceed.");
            process.exit(1);
          }
        }

        // 3. Execution (Simulated)
        const eventId = createEventId("evt");
        console.log("🚀 Executing Social Test Action on X...");

        appendLedgerEvent({
          id: eventId,
          ts: new Date().toISOString(),
          actor: "user",
          channel: "cli",
          skill: "social-test",
          intent: "post to x",
          status: "success",
          duration_ms: 10,
          risk: "high",
        });

        console.log(`✅ Success. [ledger event] ${eventId}`);
        process.exit(0);
      } catch (err: any) {
        console.error(`❌ ${err.message}`);
        // Log blocked attempt?
        process.exit(1);
      }
    }

    console.error(`Unknown skill: ${skill}`);
    console.error(`(MVP only supports: ops-status)`);
    process.exit(1);
  }

  usage();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
