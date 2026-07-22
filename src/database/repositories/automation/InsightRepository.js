import BaseRepository from '../BaseRepository';

class InsightRepository extends BaseRepository {
  constructor() {
    super('insights');
    this.hasSoftDeletes = true;
  }

  async getActiveInsights() {
    return this.findAll({
      where: { isDismissed: 0 },
      orderBy: 'confidenceScore DESC, createdAt DESC'
    });
  }
}

export default new InsightRepository();
