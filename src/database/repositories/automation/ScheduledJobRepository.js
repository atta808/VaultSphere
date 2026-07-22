import BaseRepository from '../BaseRepository';

class ScheduledJobRepository extends BaseRepository {
  constructor() {
    super('scheduled_jobs');
    this.hasSoftDeletes = true;
  }

  async getActiveJobs() {
    return this.findBy({ isEnabled: 1 });
  }
}

export default new ScheduledJobRepository();
