import AgentRepository from '../../database/repositories/agent/AgentRepository';

class AgentService {
  async getAllAgents() {
    return AgentRepository.getActiveAgents();
  }

  async getAgentById(id) {
    return AgentRepository.findById(id);
  }

  async createAgent(data) {
    return AgentRepository.create({
      uuid: AgentRepository.generateUUID(),
      ...data
    });
  }

  async updateAgent(id, data) {
    return AgentRepository.update(id, data);
  }

  async deleteAgent(id) {
    return AgentRepository.delete(id);
  }
}

export default new AgentService();
