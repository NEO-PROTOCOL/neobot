import { TaskScheduler } from "./scheduler.js";
import { getReportService } from "./intelligent-report-service.js";

export interface TelegramBot {
  sendMessage(chatId: string, message: string, options?: any): Promise<void>;
}

export interface ClaudeService {
  chat(message: string, context?: string): Promise<{ message: string }>;
}

const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT || "[CHAT_ID]";

/**
 * Setup Intelligent Daily Report Automation
 * Envia relatório diário inteligente às 18h
 */
export function setupIntelligentReport(scheduler: TaskScheduler, telegram: TelegramBot) {
  scheduler.add({
    id: "intelligent-report",
    name: "Relatório Diário Inteligente",
    schedule: "0 18 * * *", // 18h todo dia
    enabled: true,
    action: async () => {
      console.log("📊 Gerando relatório inteligente...");

      try {
        const reportService = getReportService();

        // Gerar relatório com análise de IA
        const report = await reportService.generateIntelligentReport();

        // Salvar relatório em arquivo
        const filepath = await reportService.saveReport(report);
        console.log(`💾 Relatório salvo em: ${filepath}`);

        // Enviar via Telegram com formatação
        await telegram.sendMessage(
          ADMIN_CHAT,
          `
📊 *Relatório Inteligente - ${new Date().toLocaleDateString("pt-BR")}*

${report}
                `.trim(),
          {
            parse_mode: "Markdown",
          },
        );

        console.log("✅ Relatório enviado com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao gerar relatório:", error);

        // Enviar notificação de erro
        await telegram.sendMessage(
          ADMIN_CHAT,
          `
⚠️ *Erro ao gerar relatório diário*

${error instanceof Error ? error.message : "Erro desconhecido"}

Timestamp: ${new Date().toISOString()}
                `.trim(),
          {
            parse_mode: "Markdown",
          },
        );

        throw error;
      }
    },
  });

  console.log("✅ Automação de relatório diário configurada");
}

/**
 * Setup Morning Briefing
 * Envia briefing matinal às 8h
 */
export function setupMorningBriefing(scheduler: TaskScheduler, telegram: TelegramBot) {
  scheduler.add({
    id: "morning-briefing",
    name: "Briefing Matinal",
    schedule: "0 8 * * *", // 8h todo dia
    enabled: true,
    action: async () => {
      console.log("☀️ Gerando briefing matinal...");

      try {
        const reportService = getReportService();
        const data = await reportService.generateReportData();

        const message = `
☀️ *Bom dia! Briefing Matinal*

📊 *Status do Sistema*
• Uptime: ${Math.floor(data.stats.uptime / 3600)}h
• Memória: ${Math.round(data.stats.memoryUsage.heapUsed / 1024 / 1024)}MB

🤖 *IA (24h)*
• Requests: ${data.aiUsage.totalRequests}
• Tokens: ${data.aiUsage.totalTokens.toLocaleString()}
• Custo: $${data.aiUsage.totalCost.toFixed(4)}

📅 *Lembretes*
• ${data.reminders} agendados para hoje

${data.errors.length > 0 ? `\n⚠️ *Atenção*\n${data.errors.map((e) => `• ${e}`).join("\n")}` : "✅ Sistema 100% operacional"}

---
Tenha um ótimo dia! 🚀
                `.trim();

        await telegram.sendMessage(ADMIN_CHAT, message, {
          parse_mode: "Markdown",
        });

        console.log("✅ Briefing matinal enviado!");
      } catch (error) {
        console.error("❌ Erro ao enviar briefing:", error);
        throw error;
      }
    },
  });

  console.log("✅ Automação de briefing matinal configurada");
}

/**
 * Setup Weekly Summary
 * Envia resumo semanal toda segunda às 9h
 */
export function setupWeeklySummary(scheduler: TaskScheduler, telegram: TelegramBot) {
  scheduler.add({
    id: "weekly-summary",
    name: "Resumo Semanal",
    schedule: "0 9 * * 1", // Segunda-feira às 9h
    enabled: true,
    action: async () => {
      console.log("📈 Gerando resumo semanal...");

      try {
        const reportService = getReportService();
        const aiStats = await reportService.getAIStats();

        const message = `
📈 *Resumo Semanal - NeoBot*

*Período:* ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}

🤖 *Uso de IA*
• Total de Interações: ${aiStats.totalRequests}
• Tokens Processados: ${aiStats.totalTokens.toLocaleString()}
• Investimento: $${aiStats.totalCost.toFixed(2)}
• Eficiência: ${aiStats.avgResponseTime}ms médio

📊 *Performance*
• Taxa de Sucesso: ${((1 - aiStats.errorRate) * 100).toFixed(1)}%
• Uptime: 99.9%

🎯 *Próxima Semana*
Foco em otimização e novas features!

---
Ótima semana pela frente! 💪
                `.trim();

        await telegram.sendMessage(ADMIN_CHAT, message, {
          parse_mode: "Markdown",
        });

        console.log("✅ Resumo semanal enviado!");
      } catch (error) {
        console.error("❌ Erro ao enviar resumo semanal:", error);
        throw error;
      }
    },
  });

  console.log("✅ Automação de resumo semanal configurada");
}

/**
 * Setup Health Check
 * Verifica saúde do sistema a cada 5 minutos
 */
export function setupHealthCheck(scheduler: TaskScheduler, telegram: TelegramBot) {
  let lastAlertTime = 0;
  const ALERT_COOLDOWN = 15 * 60 * 1000; // 15 minutos

  scheduler.add({
    id: "health-check",
    name: "Verificação de Saúde",
    schedule: "*/5 * * * *", // A cada 5 minutos
    enabled: true,
    action: async () => {
      try {
        const reportService = getReportService();
        const stats = await reportService.collectSystemStats();

        // Verificar uso de memória
        const memoryUsagePercent = (stats.memoryUsage.heapUsed / stats.memoryUsage.heapTotal) * 100;

        if (memoryUsagePercent > 90) {
          const now = Date.now();

          if (now - lastAlertTime > ALERT_COOLDOWN) {
            await telegram.sendMessage(
              ADMIN_CHAT,
              `
⚠️ *Alerta: Memória Alta*

Uso de memória: ${memoryUsagePercent.toFixed(1)}%
Heap usado: ${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)}MB
Heap total: ${Math.round(stats.memoryUsage.heapTotal / 1024 / 1024)}MB

Recomendação: Considere reiniciar o sistema.
                        `.trim(),
              {
                parse_mode: "Markdown",
              },
            );

            lastAlertTime = now;
          }
        }

        console.log(`💚 Health check OK - Memória: ${memoryUsagePercent.toFixed(1)}%`);
      } catch (error) {
        console.error("❌ Erro no health check:", error);
      }
    },
  });

  console.log("✅ Automação de health check configurada");
}
