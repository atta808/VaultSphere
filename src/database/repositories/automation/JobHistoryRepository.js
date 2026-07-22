import BaseRepository from '../BaseRepository';

class JobHistoryRepository extends BaseRepository {
  constructor() {
    super('job_history');
    this.hasSoftDeletes = true;
  }

  async getHistoryForJob(jobId) {
     return this.findAll({
      where: { jobId },
      orderBy: 'createdAt DESC'
    });
  }
}

export default new JobHistoryRepository();
