import cron from "node-cron";
import { dailyOpsStatusJob } from "../../cron/jobs/daily-ops-status.js";

export const jobs = [dailyOpsStatusJob];

export function startScheduler() {
  console.log("🛡️ Neobot Scheduler Starting...");

  for (const job of jobs) {
    console.log(`📡 Scheduling job: ${job.name} [${job.schedule}]`);
    cron.schedule(job.schedule, async () => {
      try {
        await job.run();
      } catch (error) {
        console.error(`❌ Error running job ${job.name}:`, error);
      }
    });
  }

  console.log("🚀 Scheduler is active and heartbeat is pulse.");
}
