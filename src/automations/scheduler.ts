import cron from "node-cron";
import { EventEmitter } from "events";

export interface ScheduledTask {
  id: string;
  name: string;
  schedule: string; // Cron expression
  enabled: boolean;
  action: () => Promise<void>;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  errorCount: number;
}

export class TaskScheduler extends EventEmitter {
  private tasks: Map<string, ScheduledTask> = new Map();
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Adicionar nova tarefa agendada
   */
  add(task: Omit<ScheduledTask, "runCount" | "errorCount">): void {
    const fullTask: ScheduledTask = {
      ...task,
      runCount: 0,
      errorCount: 0,
    };

    this.tasks.set(task.id, fullTask);

    if (task.enabled) {
      this.schedule(fullTask);
    }

    this.emit("task:added", fullTask);
  }

  /**
   * Agendar tarefa com cron
   */
  private schedule(task: ScheduledTask): void {
    try {
      const cronJob = cron.schedule(
        task.schedule,
        async () => {
          await this.executeTask(task.id);
        },
        {
          timezone: "America/Sao_Paulo",
        },
      );

      this.cronJobs.set(task.id, cronJob);

      console.log(`✅ Tarefa agendada: ${task.name} (${task.schedule})`);
    } catch (error) {
      console.error(`❌ Erro ao agendar tarefa ${task.name}:`, error);
      this.emit("task:error", { task, error });
    }
  }

  /**
   * Executar tarefa
   */
  async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);

    if (!task) {
      console.error(`Tarefa não encontrada: ${taskId}`);
      return;
    }

    console.log(`🚀 Executando: ${task.name}`);
    this.emit("task:start", task);

    const startTime = Date.now();

    try {
      await task.action();

      task.lastRun = new Date();
      task.runCount++;

      const duration = Date.now() - startTime;

      console.log(`✅ Tarefa concluída: ${task.name} (${duration}ms)`);
      this.emit("task:complete", { task, duration });
    } catch (error) {
      task.errorCount++;

      console.error(`❌ Erro na tarefa ${task.name}:`, error);
      this.emit("task:error", { task, error });
    }
  }

  /**
   * Habilitar tarefa
   */
  enable(taskId: string): void {
    const task = this.tasks.get(taskId);

    if (!task) {
      throw new Error(`Tarefa não encontrada: ${taskId}`);
    }

    task.enabled = true;
    this.schedule(task);
    this.emit("task:enabled", task);
  }

  /**
   * Desabilitar tarefa
   */
  disable(taskId: string): void {
    const task = this.tasks.get(taskId);

    if (!task) {
      throw new Error(`Tarefa não encontrada: ${taskId}`);
    }

    const cronJob = this.cronJobs.get(taskId);

    if (cronJob) {
      void cronJob.stop();
      this.cronJobs.delete(taskId);
    }

    task.enabled = false;
    this.emit("task:disabled", task);
  }

  /**
   * Remover tarefa
   */
  remove(taskId: string): void {
    this.disable(taskId);
    this.tasks.delete(taskId);
    this.emit("task:removed", taskId);
  }

  /**
   * Listar todas as tarefas
   */
  list(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Obter tarefa específica
   */
  get(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Obter estatísticas
   */
  getStats() {
    const tasks = this.list();

    return {
      total: tasks.length,
      enabled: tasks.filter((t) => t.enabled).length,
      disabled: tasks.filter((t) => !t.enabled).length,
      totalRuns: tasks.reduce((sum, t) => sum + t.runCount, 0),
      totalErrors: tasks.reduce((sum, t) => sum + t.errorCount, 0),
    };
  }

  /**
   * Parar todas as tarefas
   */
  stopAll(): void {
    for (const [_taskId, cronJob] of this.cronJobs.entries()) {
      void cronJob.stop();
    }

    this.cronJobs.clear();
    console.log("🛑 Todas as tarefas foram paradas");
  }
}

// Singleton instance
let schedulerInstance: TaskScheduler | null = null;

export function getScheduler(): TaskScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new TaskScheduler();
  }
  return schedulerInstance;
}
