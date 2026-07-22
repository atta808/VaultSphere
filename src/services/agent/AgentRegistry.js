class AgentRegistry {
  constructor() {
    this.agents = new Map();
  }

  registerAgent(agentDefinition) {
    if (!agentDefinition.name) {
      throw new Error('Agent must have a name');
    }
    this.agents.set(agentDefinition.name, agentDefinition);
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }
}

export default new AgentRegistry();
