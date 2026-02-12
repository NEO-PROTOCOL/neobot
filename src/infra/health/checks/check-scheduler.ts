import { jobs } from "../../scheduler/scheduler.js";
import type { HealthCheckResult } from "../types.js";

export async function checkSchedulerStatus(): Promise<HealthCheckResult> {
  const jobCount = jobs.length;

  return {
    key: "scheduler",
    status: jobCount > 0 ? "ok" : "warn",
    summary: jobCount > 0 ? `${jobCount} tarefas agendadas.` : "Nenhuma tarefa ativa no agendador.",
    details: {
      active_jobs: jobs.map((j) => ({ name: j.name, schedule: j.schedule })),
    },
  };
}
