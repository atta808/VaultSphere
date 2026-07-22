// Mock sync service to satisfy the architecture requirements.
// Real sync will be handled by CloudSyncService.
class AgentSyncService {
  async syncAgentExecutions() {
    console.log('Syncing agent executions...');
  }
}

export default new AgentSyncService();
