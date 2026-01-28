import { Telegraf, Context } from 'telegraf';
import { ClaudeService } from '../../ai/claude-service';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Exemplo de integração do Claude AI com Telegram
 * 
 * Este arquivo mostra como adicionar comandos de IA ao seu bot Telegram existente.
 * Você pode copiar os comandos relevantes para o seu bot principal.
 */

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const claude = new ClaudeService();

// ============================================================================
// COMANDOS DE IA
// ============================================================================

/**
 * Comando: /chat
 * Conversa direta com Claude
 */
bot.command('chat', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const message = args.join(' ');

    if (!message) {
        return ctx.reply('❌ Use: /chat <sua mensagem>');
    }

    try {
        await ctx.sendChatAction('typing');

        const userId = ctx.from.id.toString();
        const response = await claude.chat(userId, message);

        await ctx.reply(response, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Erro no /chat:', error);
        ctx.reply('❌ Desculpe, ocorreu um erro ao processar sua mensagem.');
    }
});

/**
 * Comando: /limpar
 * Limpa o histórico de conversação
 */
bot.command('limpar', (ctx) => {
    const userId = ctx.from.id.toString();
    claude.clearHistory(userId);
    ctx.reply('🗑️ Histórico de conversa limpo!');
});

/**
 * Comando: /codigo
 * Gera código em qualquer linguagem
 */
bot.command('codigo', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length < 2) {
        return ctx.reply(
            '❌ Use: /codigo <linguagem> <descrição>\n\n' +
            'Exemplo: /codigo javascript função para validar email'
        );
    }

    const language = args[0];
    const description = args.slice(1).join(' ');

    try {
        await ctx.sendChatAction('typing');

        const userId = ctx.from.id.toString();
        const code = await claude.generateCode(userId, description, language);

        await ctx.replyWithMarkdown(`\`\`\`${language}\n${code}\n\`\`\``);

    } catch (error) {
        console.error('Erro no /codigo:', error);
        ctx.reply('❌ Erro ao gerar código.');
    }
});

/**
 * Comando: /resumir
 * Resume um texto longo
 */
bot.command('resumir', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const text = args.join(' ');

    if (!text) {
        return ctx.reply('❌ Use: /resumir <texto para resumir>');
    }

    try {
        await ctx.sendChatAction('typing');

        const userId = ctx.from.id.toString();
        const summary = await claude.summarize(userId, text);

        await ctx.reply(`📝 *Resumo:*\n\n${summary}`, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Erro no /resumir:', error);
        ctx.reply('❌ Erro ao resumir texto.');
    }
});

/**
 * Comando: /traduzir
 * Traduz texto para outro idioma
 */
bot.command('traduzir', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length < 2) {
        return ctx.reply(
            '❌ Use: /traduzir <idioma> <texto>\n\n' +
            'Exemplo: /traduzir inglês Olá, como vai?'
        );
    }

    const targetLanguage = args[0];
    const text = args.slice(1).join(' ');

    try {
        await ctx.sendChatAction('typing');

        const userId = ctx.from.id.toString();
        const translation = await claude.translate(userId, text, targetLanguage);

        await ctx.reply(`🌐 *Tradução:*\n\n${translation}`, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Erro no /traduzir:', error);
        ctx.reply('❌ Erro ao traduzir texto.');
    }
});

/**
 * Comando: /stats
 * Mostra estatísticas do Claude
 */
bot.command('stats', (ctx) => {
    const stats = claude.getStats();

    const message = `
📊 *Estatísticas do Claude AI*

💬 Conversas ativas: ${stats.activeConversations}
📨 Total de mensagens: ${stats.totalMessages}
🤖 Modelo: ${stats.model}
🎯 Max tokens: ${stats.maxTokens}
  `.trim();

    ctx.replyWithMarkdown(message);
});

/**
 * Comando: /ajuda_ia
 * Mostra ajuda sobre comandos de IA
 */
bot.command('ajuda_ia', (ctx) => {
    const help = `
🤖 *Comandos de IA - Claude*

*Conversação:*
/chat <mensagem> - Conversar com Claude
/limpar - Limpar histórico de conversa

*Geração de Conteúdo:*
/codigo <linguagem> <descrição> - Gerar código
/resumir <texto> - Resumir texto
/traduzir <idioma> <texto> - Traduzir texto

*Informações:*
/stats - Ver estatísticas
/ajuda_ia - Esta mensagem

*Dica:* Você também pode enviar mensagens diretas sem comando!
  `.trim();

    ctx.replyWithMarkdown(help);
});

// ============================================================================
// PROCESSAMENTO DE MENSAGENS DIRETAS
// ============================================================================

/**
 * Processa mensagens de texto que não são comandos
 * Envia automaticamente para o Claude
 */
bot.on('text', async (ctx) => {
    const text = ctx.message.text;

    // Ignorar se for comando
    if (text.startsWith('/')) {
        return;
    }

    try {
        await ctx.sendChatAction('typing');

        const userId = ctx.from.id.toString();
        const response = await claude.chat(userId, text);

        await ctx.reply(response, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        ctx.reply('❌ Desculpe, ocorreu um erro ao processar sua mensagem.');
    }
});

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

async function main() {
    console.log('🤖 Iniciando Telegram Bot com Claude AI...\n');

    // Verificar se API key do Claude está configurada
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('❌ ANTHROPIC_API_KEY não encontrada no .env');
        process.exit(1);
    }

    // Verificar se token do Telegram está configurado
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN não encontrada no .env');
        process.exit(1);
    }

    await bot.launch();

    console.log('✅ Bot iniciado com sucesso!');
    console.log('📱 Telegram: Ativo');
    console.log('🤖 Claude AI: Integrado\n');
    console.log('Comandos disponíveis:');
    console.log('  /chat - Conversar com Claude');
    console.log('  /codigo - Gerar código');
    console.log('  /resumir - Resumir texto');
    console.log('  /traduzir - Traduzir texto');
    console.log('  /limpar - Limpar histórico');
    console.log('  /stats - Ver estatísticas');
    console.log('  /ajuda_ia - Ajuda completa\n');
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Executar
main().catch(console.error);
