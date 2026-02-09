import { getScheduler, TaskScheduler } from "./scheduler.js";
import {
  setupIntelligentReport,
  setupMorningBriefing,
  setupWeeklySummary,
  setupHealthCheck,
  WhatsAppBot,
} from "./intelligent-daily-report.js";

export interface AutomationConfig {
  enabledAutomations: string[];
  whatsapp?: WhatsAppBot;
}

export class AutomationManager {
  private scheduler: TaskScheduler;
  private config: AutomationConfig;

  constructor(config: AutomationConfig) {
    this.scheduler = getScheduler();
    this.config = config;
  }

  /**
   * Inicializar todas as automações
   */
  async initialize(): Promise<void> {
    console.log("🤖 Inicializando Automações Avançadas...");

    const { whatsapp } = this.config;

    if (!whatsapp) {
      console.warn("⚠️ WhatsApp não configurado, algumas automações podem não funcionar");
      return;
    }

    // Setup automations based on config
    if (this.isEnabled("intelligent-report")) {
      setupIntelligentReport(this.scheduler, whatsapp);
    }

    if (this.isEnabled("morning-briefing")) {
      setupMorningBriefing(this.scheduler, whatsapp);
    }

    if (this.isEnabled("weekly-summary")) {
      setupWeeklySummary(this.scheduler, whatsapp);
    }

    if (this.isEnabled("health-check")) {
      setupHealthCheck(this.scheduler, whatsapp);
    }

    // Listen to scheduler events
    this.setupEventListeners();

    console.log("✅ Automações inicializadas com sucesso!");
    console.log(`📊 Total de tarefas: ${this.scheduler.list().length}`);
  }

  /**
   * Verificar se automação está habilitada
   */
  private isEnabled(automationId: string): boolean {
    return this.config.enabledAutomations.includes(automationId);
  }

  /**
   * Configurar listeners de eventos
   */
  private setupEventListeners(): void {
    this.scheduler.on("task:start", (task) => {
      console.log(`▶️ Iniciando: ${task.name}`);
    });

    this.scheduler.on("task:complete", ({ task, duration }) => {
      console.log(`✅ Concluído: ${task.name} (${duration}ms)`);
    });

    this.scheduler.on("task:error", ({ task, error }) => {
      console.error(`❌ Erro em ${task.name}:`, error);
    });
  }

  /**
   * Obter estatísticas das automações
   */
  getStats() {
    return this.scheduler.getStats();
  }

  /**
   * Listar todas as tarefas agendadas
   */
  listTasks() {
    return this.scheduler.list().map((task) => ({
      id: task.id,
      name: task.name,
      schedule: task.schedule,
      enabled: task.enabled,
      lastRun: task.lastRun,
      runCount: task.runCount,
      errorCount: task.errorCount,
    }));
  }

  /**
   * Executar tarefa manualmente
   */
  async executeTask(taskId: string): Promise<void> {
    await this.scheduler.executeTask(taskId);
  }

  /**
   * Habilitar/desabilitar tarefa
   */
  toggleTask(taskId: string, enabled: boolean): void {
    if (enabled) {
      this.scheduler.enable(taskId);
    } else {
      this.scheduler.disable(taskId);
    }
  }

  /**
   * Parar todas as automações
   */
  stopAll(): void {
    this.scheduler.stopAll();
    console.log("🛑 Todas as automações foram paradas");
  }
}

// Singleton instance
let automationManagerInstance: AutomationManager | null = null;

export function initializeAutomations(config: AutomationConfig): AutomationManager {
  if (!automationManagerInstance) {
    automationManagerInstance = new AutomationManager(config);
  }
  return automationManagerInstance;
}

export function getAutomationManager(): AutomationManager | null {
  return automationManagerInstance;
}
