import CloudSyncService from '../cloud/CloudSyncService';

class CollaborationSyncService {
  async queueOperation(operationType, payload) {
    // Delegate queuing to the foundational CloudSyncService infrastructure.
    // entityType and entityId can be derived or passed if needed, here we default to 'collaboration'
    const entityId = payload?.id || payload?.documentId || null;
    await CloudSyncService.queueOperation('collaboration', entityId, operationType, payload);
  }
}

export default new CollaborationSyncService();
