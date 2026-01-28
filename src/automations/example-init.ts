/**
 * Exemplo de como inicializar as automações avançadas no seu bot
 *
 * Use este arquivo como referência para integrar as automações
 * no seu sistema principal.
 */

import { initializeAutomations, AutomationConfig } from "./automation-manager.js";

// Exemplo de implementação do TelegramBot
class ExampleTelegramBot {
  async sendMessage(chatId: string, message: string, options?: any): Promise<void> {
    console.log(`📤 Sending to ${chatId}:`, message);

    // Aqui você implementaria o envio real via Telegram API
    // Exemplo com a biblioteca 'node-telegram-bot-api':
    // await this.bot.sendMessage(chatId, message, options);

    // Ou com Grammy:
    // await this.bot.api.sendMessage(chatId, message, options);
  }
}

// Configuração das automações
const config: AutomationConfig = {
  enabledAutomations: [
    "intelligent-report", // Relatório diário às 18h
    "morning-briefing", // Briefing matinal às 8h
    "weekly-summary", // Resumo semanal segunda às 9h
    "health-check", // Health check a cada 5 minutos
  ],
  telegram: new ExampleTelegramBot(),
};

// Inicializar automações
async function main() {
  try {
    console.log("🚀 Iniciando sistema de automações...");

    const manager = initializeAutomations(config);
    await manager.initialize();

    console.log("✅ Sistema de automações iniciado!");
    console.log("📊 Estatísticas:", manager.getStats());

    // Exemplo: executar tarefa manualmente
    // await manager.executeTask('intelligent-report');

    // Exemplo: pausar tarefa
    // manager.toggleTask('morning-briefing', false);

    // Keep the process running
    process.on("SIGINT", () => {
      console.log("\n🛑 Encerrando automações...");
      manager.stopAll();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar automações:", error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
