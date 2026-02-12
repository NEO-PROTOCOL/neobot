// Main exports for automation system
export { TaskScheduler, getScheduler, type ScheduledTask } from "./scheduler.js";
export {
  IntelligentReportService,
  getReportService,
  type SystemStats,
  type ReportData,
} from "./intelligent-report-service.js";
export {
  setupIntelligentReport,
  setupMorningBriefing,
  setupWeeklySummary,
  setupHealthCheck,
  type TelegramBot,
  type ClaudeService,
} from "./intelligent-daily-report.js";
export {
  AutomationManager,
  initializeAutomations,
  getAutomationManager,
  type AutomationConfig,
} from "./automation-manager.js";
