import CloudSyncService from '../cloud/CloudSyncService';

class WorkflowSyncService {
  // Sync wrapper that delegates to CloudSyncService (which puts into sync_queue)

  async queueWorkflowSync(workflowId, payload) {
    // prepare workflow payload
    await CloudSyncService.queueOperation('workflow', workflowId, 'UPDATE', payload);
  }
}

export default new WorkflowSyncService();
