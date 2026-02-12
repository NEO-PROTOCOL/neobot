#!/usr/bin/env node

/**
 * Helper para descobrir Chat IDs do Telegram
 * 
 * Uso:
 * 1. Rode este script: node skills/telegram/scripts/get-chat-id.ts
 * 2. Peça para a pessoa enviar uma mensagem para seu bot
 * 3. O script vai mostrar o Chat ID dela
 */

import { Bot } from "grammy";
import { loadDotEnv } from "../../../src/infra/dotenv.js";

loadDotEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN não encontrado no .env");
    process.exit(1);
}

console.log("🤖 Bot iniciado! Aguardando mensagens...");
console.log("📱 Peça para alguém enviar /start para o bot");
console.log("🔍 Vou mostrar o Chat ID de quem enviar mensagem\n");

const bot = new Bot(token);

bot.on("message", (ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from?.username ? `@${ctx.from.username}` : "sem username";
    const firstName = ctx.from?.first_name || "Desconhecido";
    const lastName = ctx.from?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`👤 Nome: ${fullName}`);
    console.log(`🆔 Username: ${username}`);
    console.log(`🔢 Chat ID: ${chatId}`);
    console.log(`📝 Mensagem: ${ctx.message.text || "(mídia)"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    ctx.reply(
        `Olá ${firstName}! 👋\n\n` +
        `Seu Chat ID é: \`${chatId}\`\n` +
        `Username: ${username}\n\n` +
        `Use este Chat ID para receber mensagens agendadas!`,
        { parse_mode: "Markdown" }
    );
});

bot.start();

console.log("✅ Bot rodando! Pressione Ctrl+C para parar.\n");
