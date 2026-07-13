class BackupScheduler {
  constructor() {
    this.schedules = {
      MANUAL: 'manual',
      DAILY: 'daily',
      WEEKLY: 'weekly',
      MONTHLY: 'monthly',
      ON_LAUNCH: 'on_launch'
    };
    this.currentSchedule = this.schedules.MANUAL;
  }

  setSchedule(scheduleType) {
    if (Object.values(this.schedules).includes(scheduleType)) {
      this.currentSchedule = scheduleType;
      // In a future phase, this would register background tasks
    }
  }

  getSchedule() {
    return this.currentSchedule;
  }

  async runScheduledBackupIfNeeded() {
    // Architecture only. In future phases, this will check last backup time
    // and run BackupService if needed based on currentSchedule.
    return false;
  }
}

export default new BackupScheduler();
