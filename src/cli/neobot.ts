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
                  ▶ Olá! Eu sou o Neobot. ◀
    
    ================================================================
`.trim(),
  );
}

function usage() {
  banner();
  console.log(
    `
Como eu posso te ajudar hoje? Aqui está o que eu sei fazer:

🛠️  SKILLS & AÇÃO
  neobot run <skill> [args...]       Me pede para executar uma tarefa (Ex: ops-status)

🩺  SAÚDE & DIAGNÓSTICO
  neobot health [--full] [--repair]  Eu verifico se meu sistema está saudável
  neobot whoami                      Eu te digo quem eu sou e o que tenho por perto
  neobot config show                 Eu mostro como estou configurado agora

📖  MEMÓRIA & AUDITORIA (Ledger)
  neobot explain <id>                Eu te explico o que aconteceu em um evento (IDs são timestamps)
  neobot anchor latest               Eu te mostro minha última prova de integridade diária
  neobot ledger tail [n]             Eu listo as últimas [n] páginas da minha memória técnica
  neobot ledger path                 Eu te digo onde guardo minha caixa preta

⏰  AGENDAMENTO (Cron)
  neobot schedule "..."              Fala o que quer agendar em linguagem natural
  neobot cron list                   Vê o que eu tenho agendado para o futuro
  neobot cron run <job>              Me faz rodar uma tarefa agendada agora mesmo
  neobot cron start                  Coloca meu relógio para despertar sozinho

Dica: Se estiver perdido, tente "pnpm neobot health --full" para um papo mais detalhado.
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

    const format = isJson ? "json" : isYaml ? "yaml" : "chat";
    const isFull = allArgs.includes("--full");
    const doRepair = allArgs.includes("--repair");
    const sinceIdx = allArgs.indexOf("--since");
    const sinceHours = sinceIdx !== -1 ? parseInt(allArgs[sinceIdx + 1]) || 24 : 24;

    const report = await runHealthCheck({ sinceHours, doRepair });
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

  if (cmd === "anchor") {
    if (subcmd === "latest") {
      const { getLatestAnchor } = await import("../infra/health/anchor.js");
      const latest = await getLatestAnchor();
      if (!latest) {
        console.log("❌ Nenhuma âncora encontrada.");
        process.exit(1);
      }
      console.log(`\n⚓ Aqui está minha última âncora de saúde (prova de integridade):`);
      console.log(`- Data: ${latest.date}`);
      console.log(`- Hash da Corrente: ${latest.ledger_hash}`);
      console.log(`- Última Linha do Ledger: ${latest.checkpoint_line}`);
      console.log(`- Gerada em: ${latest.ts}`);
      console.log(`\n✅ Minha memória está protegida e validada.`);
      process.exit(0);
    }
  }

  if (cmd === "cron") {
    const { jobs: hardcodedJobs, startScheduler: startHardcoded } =
      await import("../infra/scheduler/scheduler.js");
    const { loadCronStore, resolveCronStorePath } = await import("../cron/store.js");
    const { loadConfig } = await import("../config/config.js");
    const { createDefaultDeps } = await import("./deps.js");
    const { buildGatewayCronService } = await import("../gateway/server-cron.js");

    const cfg = loadConfig();
    const deps = createDefaultDeps();
    const gatewayCron = buildGatewayCronService({
      cfg,
      deps,
      broadcast: () => { },
    });

    if (subcmd === "list") {
      console.log("📋 Tarefas Hardcoded (infra):");
      hardcodedJobs.forEach((j) => console.log(`- ${j.name}: ${j.schedule}`));

      console.log("\n📋 Tarefas Dinâmicas (jobs.json):");
      const store = await loadCronStore(resolveCronStorePath(cfg.cron?.store));
      if (store.jobs.length === 0) {
        console.log("(Nenhuma tarefa agendada)");
      } else {
        store.jobs.forEach((j) => {
          const status = j.enabled ? "✅" : "❌";
          const schedule =
            j.schedule.kind === "at"
              ? new Date(j.schedule.atMs).toLocaleString()
              : JSON.stringify(j.schedule);
          console.log(`${status} [${j.id.slice(0, 8)}] ${j.name}: ${schedule}`);
        });
      }
      process.exit(0);
    }

    if (subcmd === "run") {
      const target = rest[0];
      if (!target) {
        console.error("❌ Use: neobot cron run <nome_ou_id>");
        process.exit(1);
      }

      // Try hardcoded first
      const hardcoded = hardcodedJobs.find((j) => j.name === target);
      if (hardcoded) {
        console.log(`📡 Executando tarefa hardcoded: ${hardcoded.name}...`);
        await hardcoded.run();
        process.exit(0);
      }

      // Try dynamic
      console.log(`📡 Procurando tarefa dinâmica: ${target}...`);
      try {
        const result = await gatewayCron.cron.run(target, "force");
        console.log(`✅ Resultado: ${JSON.stringify(result)}`);
      } catch (err) {
        console.error(`❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
      }
      process.exit(0);
    }

    if (subcmd === "start") {
      console.log("🛠️ Iniciando todos os agendadores...");
      startHardcoded();
      await gatewayCron.cron.start();
      console.log("🚀 Todos os sistemas de agendamento ativos.");
      // Keep alive
      process.stdin.resume();
      return;
    }

    usage();
    process.exit(1);
  }

  if (cmd === "schedule") {
    const userInput = rest.join(" ").trim();
    if (!userInput) {
      console.log(
        "Diga-me o que você quer agendar. Ex: 'neobot schedule agende uma tarefa em 15 min'",
      );
      process.exit(1);
    }

    const { runCronIsolatedAgentTurn } = await import("../cron/isolated-agent/run.js");
    const { loadConfig } = await import("../config/config.js");
    const { createDefaultDeps } = await import("./deps.js");

    const cfg = loadConfig();
    const deps = createDefaultDeps();

    console.log("⏳ Deixa que eu cuido disso...");

    const prompt = `
O usuário quer agendar uma tarefa. Analise o pedido dele e use a ferramenta 'scheduler' para agendar.
Pedido: "${userInput}"

Se o tempo for relativo (ex: 15 min), passe como "in 15 minutes".

Importante: Use a skill 'scheduler' para efetivar o agendamento através do script 'skills/scheduler/scripts/scheduler.sh'.
Se o usuário pediu duas mensagens, use a ferramenta duas vezes com horários diferentes.
`.trim();

    try {
      const result = await runCronIsolatedAgentTurn({
        cfg,
        deps,
        job: {
          id: "adhoc-scheduler",
          name: "Conversational Scheduler",
          enabled: true,
          createdAtMs: Date.now(),
          updatedAtMs: Date.now(),
          schedule: { kind: "at", atMs: Date.now() },
          sessionTarget: "isolated",
          wakeMode: "now",
          payload: { kind: "systemEvent", text: "parse schedule" },
          state: {},
        },
        message: prompt,
        sessionKey: "cli:schedule:" + Date.now(),
      });

      if (result.status === "ok") {
        console.log("\n✅ Tudo certo! Já está no meu calendário.");
        if (result.outputText) console.log(`\nDetalhes: ${result.outputText}`);
      } else {
        console.error(`\n❌ Tive um problema ao agendar: ${result.error}`);
      }
    } catch (err) {
      console.error(
        `\n❌ Erro crítico no agendador: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    process.exit(0);
  }

  if (cmd === "whoami") {
    const cfg = loadRuntimeConfig();
    const user = os.userInfo();
    const isJson = process.argv.includes("--json");
    if (isJson) {
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
    } else {
      console.log(`\n👋 Olá! Eu sou o NEØ BOT.`);
      console.log(`👤 Estou rodando como o usuário "${user.username}" neste mac.`);
      console.log(`📍 Meu diretório atual é: ${process.cwd()}`);
      console.log(`🟢 Versão do Node.js: ${process.version}`);
      console.log(`📂 Configuração carregada de: config/neobot.runtime.json`);

      const channels = Object.entries(cfg.channels ?? {})
        .filter(([, v]) => v?.enabled === true)
        .map(([k]) => k);
      console.log(`📡 Canais ativos: ${channels.join(", ") || "Nenhum"}`);

      const executors = Object.entries(cfg.executors ?? {})
        .filter(([, v]) => v?.enabled === true)
        .map(([k]) => k);
      console.log(`🛠️  Ferramentas (Executors) prontas: ${executors.join(", ") || "Nenhuma"}`);
    }
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

      if (process.argv.includes("--json")) {
        console.log(last.join("\n"));
      } else {
        console.log(`\n📖 Lendo as últimas ${last.length} memórias do meu Ledger:\n`);
        console.log(last.join("\n"));
        console.log(
          `\n💡 Use "pnpm neobot explain <timestamp>" para eu te explicar qualquer linha dessas.`,
        );
      }
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

      console.log(`\n🚀 Executando tarefa: ${skill}...\n`);
      console.log("------------------------------------------");
      console.log(res.stdout.trim());
      console.log("------------------------------------------");

      if (!res.ok) {
        console.error(`\n❌ Opa, algo deu errado:`);
        console.error(res.stderr.trim());
        console.error(`\n[Evento registrado na memória: ${res.eventId}]`);
        process.exit(1);
      }

      console.log(`\n✅ Tarefa concluída com sucesso!`);
      console.log(`[Evento registrado na memória: ${res.eventId}]`);
      process.exit(0);
    }

    if (skill === "social-test") {
      const { assertSocialEnabled, requiresConfirmation } =
        await import("../config/runtime-config.js");
      const { appendLedgerEvent, createEventId } = await import("../infra/ledger/ledger.js");

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

  // Commands not handled above (message, channels, gateway, neo:*, etc.) delegate to full Moltbot CLI
  const { runCli } = await import("./run-main.js");
  await runCli(process.argv);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
