import { Cron } from "croner";
import { dailyOpsStatusJob } from "../../cron/jobs/daily-ops-status.js";
import { ecosystemProbeJob } from "../../cron/jobs/ecosystem-probe.js";

export const jobs = [dailyOpsStatusJob, ecosystemProbeJob];

export function startScheduler() {
  console.log("🛡️ Neobot Scheduler Starting...");

  for (const job of jobs) {
    console.log(`📡 Scheduling job: ${job.name} [${job.schedule}]`);
    new Cron(job.schedule, async () => {
      try {
        await job.run();
      } catch (error) {
        console.error(`❌ Error running job ${job.name}:`, error);
      }
    });
  }

  console.log("🚀 Scheduler is active and heartbeat is pulse.");
}
