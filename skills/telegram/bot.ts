#!/usr/bin/env node
/**
 * @file bot.ts
 * @description Telegram Bot integration with NEØ Protocol skills
 * @usage pnpm moltbot telegram start
 */

import TelegramBot from 'node-telegram-bot-api';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load from .env
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in .env');
  process.exit(1);
}

// Create bot
const bot = new TelegramBot(TOKEN!, { polling: true });

console.log('🤖 NEØ Telegram Bot · Starting...');
if (CHAT_ID) {
  console.log(`📱 Chat ID configured`);
}
console.log('');

// Command handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `🦞 Welcome to NEØ Protocol Bot!

Available commands:
/status - System status
/projetos - List all projects
/log <message> - Add work log
/task - View tasks
/factory - Smart Factory commands
/flowpay - FlowPay commands
/help - Show this help`
  );
});

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '⏳ Checking status...');

  try {
    const { stdout } = await execAsync('cd /Users/nettomello/neomello/01-neo-protocol-org/neobot && pnpm moltbot factory status --network all');
    bot.sendMessage(chatId, `📊 NEØ Protocol Status:\n\n\`\`\`\n${stdout}\n\`\`\``, {
      parse_mode: 'Markdown',
    });
  } catch (error: any) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

bot.onText(/\/factory (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match![1];

  bot.sendMessage(chatId, '⏳ Executing factory command...');

  try {
    const { stdout } = await execAsync(`cd /Users/nettomello/neomello/01-neo-protocol-org/neobot && pnpm moltbot factory ${args}`);
    bot.sendMessage(chatId, `🏭 Smart Factory:\n\n\`\`\`\n${stdout}\n\`\`\``, {
      parse_mode: 'Markdown',
    });
  } catch (error: any) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

bot.onText(/\/flowpay (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match![1];

  bot.sendMessage(chatId, '⏳ Executing FlowPay command...');

  try {
    const { stdout } = await execAsync(`cd /Users/nettomello/neomello/01-neo-protocol-org/neobot && pnpm moltbot flowpay ${args}`);
    bot.sendMessage(chatId, `💳 FlowPay:\n\n\`\`\`\n${stdout}\n\`\`\``, {
      parse_mode: 'Markdown',
    });
  } catch (error: any) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

bot.onText(/\/log (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const message = match![1];

  bot.sendMessage(chatId, '⏳ Adding work log...');

  try {
    // Call Notion API to add work log (placeholder)
    bot.sendMessage(chatId, `✅ Work log added:\n"${message}"`);
  } catch (error: any) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

bot.onText(/\/projetos/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '⏳ Fetching projects from Notion...');

  try {
    // Fetch from Notion (placeholder)
    const projects = `
📁 NEØ Protocol Projects:

🟢 Neobot (Ativo)
🟢 FlowPay (90% - Produção)
🟡 Smart Factory (Em análise)
🟢 neo-agent-full (Ativo)
⚫ smart-ui (Pausado)
`;
    bot.sendMessage(chatId, projects);
  } catch (error: any) {
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `📖 NEØ Bot Commands:

**System:**
/status - Overall status
/projetos - List projects
/log <msg> - Add work log
/task - View TODOs

**Smart Factory:**
/factory status - Check deployments
/factory deploy --network base - Deploy
/factory mint --amount 1000 --to 0x... - Mint

**FlowPay:**
/flowpay status --recent - Recent txs
/flowpay buy --amount 100 --token NEOFLW - Buy

Use /start to begin`,
    { parse_mode: 'Markdown' }
  );
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
});

console.log('✅ Bot started successfully!');
console.log('💬 Send /start to begin');
