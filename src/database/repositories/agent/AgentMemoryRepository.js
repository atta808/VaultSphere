import BaseRepository from '../BaseRepository';

class AgentMemoryRepository extends BaseRepository {
  constructor() {
    super('agent_memory');
    this.hasSoftDeletes = true;
  }

  async getMemoryForAgent(agentId, contextType = null) {
    const conditions = { agentId };

    if (contextType) {
      conditions.contextType = contextType;
    }

    return this.findAll({ where: conditions, orderBy: 'createdAt DESC' });
  }
}

export default new AgentMemoryRepository();
