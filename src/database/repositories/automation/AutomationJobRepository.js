import BaseRepository from '../BaseRepository';

class AutomationJobRepository extends BaseRepository {
  constructor() {
    super('automation_jobs');
    this.hasSoftDeletes = true;
  }

  async getActiveJobsForTrigger(triggerEvent) {
    return this.findBy({ isEnabled: 1, triggerEvent });
  }
}

export default new AutomationJobRepository();
