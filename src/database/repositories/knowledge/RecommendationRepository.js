import BaseRepository from '../BaseRepository';

class RecommendationRepository extends BaseRepository {
  constructor() {
    super('recommendations');
  }

  async findByTarget(targetType, targetId) {
    return this.find('targetType = ? AND targetId = ?', [targetType, targetId]);
  }
}

export default new RecommendationRepository();
