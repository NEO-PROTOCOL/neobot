#!/usr/bin/env node

/**
 * Sistema de Lembretes Pessoais via Telegram
 * Usa o comando 'at' do sistema - SEM precisar de API da Anthropic
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";
import process from "node:process";
import path from "node:path";

const execAsync = promisify(exec);

const TELEGRAM_SCRIPT = path.resolve(process.cwd(), "skills/telegram/scripts/telegram.ts");
const MY_CHAT_ID = process.env.MY_TELEGRAM_CHAT_ID || "[CHAT_ID]";

function parseTime(when: string): Date | null {
    const now = new Date();

    // "in X minutes"
    const inMinMatch = when.match(/in (\d+) minutes?/i);
    if (inMinMatch) {
        const mins = parseInt(inMinMatch[1], 10);
        return new Date(now.getTime() + mins * 60 * 1000);
    }

    // "in X hours"
    const inHourMatch = when.match(/in (\d+) hours?/i);
    if (inHourMatch) {
        const hours = parseInt(inHourMatch[1], 10);
        return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    // "em X minutos" (português)
    const emMinMatch = when.match(/em (\d+) minutos?/i);
    if (emMinMatch) {
        const mins = parseInt(emMinMatch[1], 10);
        return new Date(now.getTime() + mins * 60 * 1000);
    }

    // "em X horas" (português)
    const emHourMatch = when.match(/em (\d+) horas?/i);
    if (emHourMatch) {
        const hours = parseInt(emHourMatch[1], 10);
        return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    return null;
}

async function scheduleReminder(reminderText: string, targetTime: Date) {
    const timeStr = targetTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });

    const command = `cd ${process.cwd()} && pnpm tsx ${TELEGRAM_SCRIPT} --to ${MY_CHAT_ID} --message "🔔 LEMBRETE: ${reminderText}"`;

    try {
        const atCommand = `echo '${command}' | at ${timeStr}`;
        await execAsync(atCommand);
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log(`
📅 Sistema de Lembretes Pessoais (SEM precisar de IA!)

Uso:
  pnpm tsx skills/reminders/remind.ts "texto do lembrete" "quando"

Exemplos:
  pnpm tsx skills/reminders/remind.ts "Beber água" "in 30 minutes"
  pnpm tsx skills/reminders/remind.ts "Ligar para mãe" "in 2 hours"
  pnpm tsx skills/reminders/remind.ts "Academia" "em 1 hora"

Formatos aceitos:
  - "in X minutes" - Daqui a X minutos
  - "in X hours" - Daqui a X horas
  - "em X minutos" - Português também funciona
  - "em X horas" - Português também funciona
    `);
        process.exit(1);
    }

    const reminderText = args[0];
    const when = args[1];

    console.log(`📅 Agendando lembrete...`);
    console.log(`📝 "${reminderText}"`);
    console.log(`⏰ Quando: ${when}\n`);

    const targetTime = parseTime(when);

    if (!targetTime) {
        console.error(`❌ Formato de tempo não reconhecido: "${when}"`);
        console.log(`💡 Use: "in X minutes", "in X hours", "em X minutos", ou "em X horas"`);
        process.exit(1);
    }

    const success = await scheduleReminder(reminderText, targetTime);

    if (success) {
        console.log(`✅ Lembrete agendado para ${targetTime.toLocaleString('pt-BR')}`);
        console.log(`📱 Você receberá: "🔔 LEMBRETE: ${reminderText}"`);
        console.log(`\n💡 O lembrete será enviado automaticamente pelo sistema.`);
    } else {
        console.error(`❌ Erro ao agendar lembrete.`);
        console.log(`💡 Certifique-se de que o comando 'at' está instalado no sistema.`);
        process.exit(1);
    }
}

main();
