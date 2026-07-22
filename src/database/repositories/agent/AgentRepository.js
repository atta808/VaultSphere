import BaseRepository from '../BaseRepository';

class AgentRepository extends BaseRepository {
  constructor() {
    super('agents');
    this.hasSoftDeletes = true;
  }

  async getActiveAgents() {
    return this.findAll();
  }

  async getByType(type) {
    return this.findBy({ type });
  }
}

export default new AgentRepository();
