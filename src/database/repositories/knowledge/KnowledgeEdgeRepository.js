import BaseRepository from '../BaseRepository';

class KnowledgeEdgeRepository extends BaseRepository {
  constructor() {
    super('knowledge_edges');
  }

  async findBySource(sourceNodeId) {
    return this.find('sourceNodeId = ?', [sourceNodeId]);
  }

  async findByTarget(targetNodeId) {
    return this.find('targetNodeId = ?', [targetNodeId]);
  }
}

export default new KnowledgeEdgeRepository();
