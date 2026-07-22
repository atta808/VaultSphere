import AgentMemoryRepository from '../../database/repositories/agent/AgentMemoryRepository';

class AgentMemoryService {
  async getMemory(agentId, contextType = null) {
    return AgentMemoryRepository.getMemoryForAgent(agentId, contextType);
  }

  async addMemory(agentId, contextType, contextData, metadata = {}) {
    return AgentMemoryRepository.create({
      uuid: AgentMemoryRepository.generateUUID(),
      agentId,
      contextType,
      contextData: JSON.stringify(contextData),
      metadata: JSON.stringify(metadata)
    });
  }

  async clearMemory(agentId) {
    // Soft delete all memories for this agent
    const memories = await this.getMemory(agentId);
    for (const memory of memories) {
      await AgentMemoryRepository.delete(memory.id);
    }
  }
}

export default new AgentMemoryService();
