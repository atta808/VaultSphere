import ScheduledJobRepository from '../../database/repositories/automation/ScheduledJobRepository';
import JobHistoryRepository from '../../database/repositories/automation/JobHistoryRepository';
import AutomationHubService from './AutomationHubService';
import JobQueueService from './JobQueueService';
import { Logger } from '../../utils/logger/Logger';

// This acts as a hybrid scheduler. In a real app, Expo TaskManager would be registered
// at the root level to handle background execution, calling into this service.
class SchedulerService {
  constructor() {
    this.timer = null;
  }

  start() {
    if (this.timer) return;

    // Check every minute
    this.timer = setInterval(() => {
      this.checkAndRunJobs();
    }, 60000);

    // Check immediately on start
    this.checkAndRunJobs();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async checkAndRunJobs() {
    try {
      const activeJobs = await ScheduledJobRepository.getActiveJobs();
      const now = new Date();

      for (const job of activeJobs) {
        if (job.nextRunAt && new Date(job.nextRunAt) <= now) {
          JobQueueService.enqueue(() => this.executeJob(job));
        }
      }
    } catch (error) {
      Logger.error('Failed to check scheduled jobs', error);
    }
  }

  async executeJob(job) {
    const history = await JobHistoryRepository.create({
      uuid: JobHistoryRepository.generateUUID(),
      jobId: job.id,
      status: 'RUNNING',
      startedAt: new Date().toISOString()
    });

    try {
      // Decode payload to determine what to do
      const payload = job.payload ? JSON.parse(job.payload) : {};

      if (job.jobType === 'AUTOMATION_TRIGGER') {
         await AutomationHubService.handleEvent(payload.triggerEvent, payload.data || {});
      } else {
         // Handle other job types (e.g. BACKUP, REINDEX)
         Logger.info(`Executing scheduled job ${job.name} of type ${job.jobType}`);
      }

      await JobHistoryRepository.update(history.id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString()
      });

      // Calculate next run if recurring (simplified)
      if (job.scheduleType !== 'ONCE') {
         await this._updateNextRun(job);
      } else {
         await ScheduledJobRepository.update(job.id, { isEnabled: 0 }); // Disable one-time jobs
      }

    } catch (error) {
      await JobHistoryRepository.update(history.id, {
        status: 'FAILED',
        errorData: JSON.stringify({ message: error.message }),
        completedAt: new Date().toISOString()
      });
    }
  }

  async _updateNextRun(job) {
     // In reality, we'd parse job.cronExpression here (using a library like cron-parser).
     // For this phase, we just add a day for daily jobs.
     const nextRun = new Date();

     if (job.scheduleType === 'DAILY') {
       nextRun.setDate(nextRun.getDate() + 1);
     } else if (job.scheduleType === 'HOURLY') {
       nextRun.setHours(nextRun.getHours() + 1);
     }

     await ScheduledJobRepository.update(job.id, { nextRunAt: nextRun.toISOString() });
  }
}

export default new SchedulerService();
