import BaseRepository from '../BaseRepository';

class KnowledgeNodeRepository extends BaseRepository {
  constructor() {
    super('knowledge_nodes');
  }

  async findByType(nodeType) {
    return this.find('nodeType = ?', [nodeType]);
  }
}

export default new KnowledgeNodeRepository();
