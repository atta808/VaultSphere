import BaseRepository from '../BaseRepository';

class EmbeddingRepository extends BaseRepository {
  constructor() {
    super('embeddings');
  }

  async findByTarget(targetType, targetId) {
    return this.find('targetType = ? AND targetId = ?', [targetType, targetId]);
  }
}

export default new EmbeddingRepository();
