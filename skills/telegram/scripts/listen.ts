#!/usr/bin/env node

/**
 * Listener de mensagens do Telegram
 * Mostra todas as mensagens recebidas em tempo real
 */

import { Bot } from "grammy";
import { loadDotEnv } from "../../../src/infra/dotenv.js";

loadDotEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN não encontrado no .env");
    process.exit(1);
}

console.log("🎧 Listener de Mensagens Ativo!");
console.log("📱 Aguardando mensagens...\n");

const bot = new Bot(token);

bot.on("message", async (ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from?.username ? `@${ctx.from.username}` : "sem username";
    const firstName = ctx.from?.first_name || "Desconhecido";
    const lastName = ctx.from?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const messageText = ctx.message.text || ctx.message.caption || "(mídia)";
    const messageId = ctx.message.message_id;
    const timestamp = new Date(ctx.message.date * 1000).toLocaleString("pt-BR");

    // Detectar se é resposta
    const isReply = ctx.message.reply_to_message;
    const replyToId = isReply ? ctx.message.reply_to_message?.message_id : null;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`⏰ ${timestamp}`);
    console.log(`👤 ${fullName} (${username})`);
    console.log(`🔢 Chat ID: ${chatId}`);
    console.log(`📨 Message ID: ${messageId}`);
    if (isReply) {
        console.log(`↩️  Respondendo à mensagem #${replyToId}`);
    }
    console.log(`💬 "${messageText}"`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Notificação sonora (opcional)
    if (process.stdout.isTTY) {
        process.stdout.write("\x07"); // Beep
    }
});

// Handler para edições de mensagem
bot.on("edited_message", async (ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from?.username ? `@${ctx.from.username}` : "sem username";
    const firstName = ctx.from?.first_name || "Desconhecido";
    const messageText = ctx.editedMessage.text || "(mídia)";
    const messageId = ctx.editedMessage.message_id;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✏️  MENSAGEM EDITADA`);
    console.log(`👤 ${firstName} (${username})`);
    console.log(`🔢 Chat ID: ${chatId}`);
    console.log(`📨 Message ID: ${messageId}`);
    console.log(`💬 "${messageText}"`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

// Handler para quando alguém está digitando
bot.on("message:text", async (ctx) => {
    // Só para garantir que está recebendo
});

bot.catch((err) => {
    console.error("❌ Erro no bot:", err);
});

bot.start();

console.log("✅ Listener rodando!");
console.log("💡 Dica: Deixe este terminal aberto para ver as mensagens");
console.log("🛑 Pressione Ctrl+C para parar\n");
