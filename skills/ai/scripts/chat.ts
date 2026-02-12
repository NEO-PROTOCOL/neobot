#!/usr/bin/env tsx

import { ClaudeService } from '../claude-service';
import * as readline from 'readline';

/**
 * Script de chat interativo com Claude via CLI
 * 
 * Uso:
 *   pnpm tsx skills/ai/scripts/chat.ts
 *   pnpm tsx skills/ai/scripts/chat.ts "pergunta rápida"
 */

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const claude = new ClaudeService();
const userId = 'cli-user';

async function chat(message: string): Promise<string> {
    try {
        const response = await claude.chat(userId, message);
        return response;
    } catch (error) {
        if (error instanceof Error) {
            return `❌ Erro: ${error.message}`;
        }
        return '❌ Erro desconhecido';
    }
}

async function interactiveMode() {
    console.log('🤖 NeoBot Claude AI - Modo Interativo\n');
    console.log('Digite suas mensagens (ou "sair" para encerrar)\n');

    const askQuestion = () => {
        rl.question('Você: ', async (input) => {
            const message = input.trim();

            if (!message) {
                askQuestion();
                return;
            }

            if (message.toLowerCase() === 'sair' || message.toLowerCase() === 'exit') {
                console.log('\n👋 Até logo!');
                rl.close();
                return;
            }

            if (message.toLowerCase() === 'limpar') {
                claude.clearHistory(userId);
                console.log('🗑️  Histórico limpo!\n');
                askQuestion();
                return;
            }

            if (message.toLowerCase() === 'stats') {
                const stats = claude.getStats();
                console.log('\n📊 Estatísticas:');
                console.log(`   Conversas ativas: ${stats.activeConversations}`);
                console.log(`   Total de mensagens: ${stats.totalMessages}`);
                console.log(`   Modelo: ${stats.model}\n`);
                askQuestion();
                return;
            }

            console.log('\n🤔 Pensando...\n');

            const response = await chat(message);
            console.log(`Claude: ${response}\n`);

            askQuestion();
        });
    };

    askQuestion();
}

async function singleMessage(message: string) {
    console.log('🤖 NeoBot Claude AI\n');
    console.log(`Você: ${message}\n`);
    console.log('🤔 Pensando...\n');

    const response = await chat(message);
    console.log(`Claude: ${response}\n`);
}

// Main
const args = process.argv.slice(2);

if (args.length > 0) {
    // Modo single message
    const message = args.join(' ');
    singleMessage(message).then(() => process.exit(0));
} else {
    // Modo interativo
    interactiveMode();
}
