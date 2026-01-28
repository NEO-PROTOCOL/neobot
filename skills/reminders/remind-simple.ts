#!/usr/bin/env node

/**
 * Sistema de Lembretes usando CRON do Sistema (sem IA)
 * Mais simples e direto - não precisa de API da Anthropic
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";
import process from "node:process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const execAsync = promisify(exec);

const TELEGRAM_SCRIPT = path.resolve(process.cwd(), "skills/telegram/scripts/telegram.ts");
const MY_CHAT_ID = process.env.MY_TELEGRAM_CHAT_ID || "6582122066";
const CRON_FILE = path.join(os.homedir(), ".neobot-reminders.cron");

function parseToCron(when: string): { cronExpr?: string; atTime?: Date } {
    const now = new Date();

    // "in X minutes"
    const inMinMatch = when.match(/in (\d+) minutes?/i);
    if (inMinMatch) {
        const mins = parseInt(inMinMatch[1], 10);
        const targetTime = new Date(now.getTime() + mins * 60 * 1000);
        return { atTime: targetTime };
    }

    // "in X hours"
    const inHourMatch = when.match(/in (\d+) hours?/i);
    if (inHourMatch) {
        const hours = parseInt(inHourMatch[1], 10);
        const targetTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return { atTime: targetTime };
    }

    // "em X minutos" (português)
    const emMinMatch = when.match(/em (\d+) minutos?/i);
    if (emMinMatch) {
        const mins = parseInt(emMinMatch[1], 10);
        const targetTime = new Date(now.getTime() + mins * 60 * 1000);
        return { atTime: targetTime };
    }

    // Cron expression (já está no formato certo)
    if (when.includes("*")) {
        return { cronExpr: when };
    }

    return {};
}

async function scheduleWithAt(reminderText: string, targetTime: Date) {
    // Usar o comando 'at' do sistema
    const timeStr = targetTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });

    const command = `cd ${process.cwd()} && pnpm tsx ${TELEGRAM_SCRIPT} --to ${MY_CHAT_ID} --message "🔔 LEMBRETE: ${reminderText}"`;

    try {
        // Usar 'at' para agendar
        const atCommand = `echo '${command}' | at ${timeStr}`;
        await execAsync(atCommand);
        console.log(`✅ Lembrete agendado para ${targetTime.toLocaleString('pt-BR')}`);
        console.log(`📱 Você receberá: "🔔 LEMBRETE: ${reminderText}"`);
    } catch (error) {
        console.error("❌ Erro ao usar 'at'. Tentando método alternativo...");
        // Fallback: usar setTimeout (só funciona se o processo ficar rodando)
        const delay = targetTime.getTime() - Date.now();
        if (delay > 0) {
            setTimeout(async () => {
                try {
                    await execAsync(command);
                    console.log(`✅ Lembrete enviado: ${reminderText}`);
                } catch (err) {
                    console.error(`❌ Erro ao enviar lembrete: ${err}`);
                }
            }, delay);
            console.log(`⚠️  Lembrete agendado em memória. Mantenha este processo rodando!`);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log(`
📅 Sistema de Lembretes Simples (sem IA)

Uso:
  pnpm tsx skills/reminders/remind-simple.ts "texto" "quando"

Exemplos:
  pnpm tsx skills/reminders/remind-simple.ts "Beber água" "in 30 minutes"
  pnpm tsx skills/reminders/remind-simple.ts "Academia" "in 2 hours"
  pnpm tsx skills/reminders/remind-simple.ts "Reunião" "em 15 minutos"

Nota: Este sistema usa o 'at' do sistema operacional, não precisa de API da Anthropic.
    `);
        process.exit(1);
    }

    const reminderText = args[0];
    const when = args[1];

    console.log(`📅 Criando lembrete...`);
    console.log(`📝 "${reminderText}"`);
    console.log(`⏰ Quando: ${when}\n`);

    const parsed = parseToCron(when);

    if (parsed.atTime) {
        await scheduleWithAt(reminderText, parsed.atTime);
    } else {
        console.error(`❌ Formato de tempo não reconhecido: ${when}`);
        console.log(`💡 Use: "in X minutes", "in X hours", ou "em X minutos"`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error("❌ Erro:", err);
    process.exit(1);
});
