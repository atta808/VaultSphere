import BaseRepository from '../BaseRepository';

class AgentExecutionRepository extends BaseRepository {
  constructor() {
    super('agent_executions');
    this.hasSoftDeletes = true;
  }

  async getExecutionsForAgent(agentId) {
     return this.findAll({
      where: { agentId },
      orderBy: 'createdAt DESC'
    });
  }
}

export default new AgentExecutionRepository();
