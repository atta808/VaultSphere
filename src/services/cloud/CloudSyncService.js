import SyncQueueRepository from '../../database/repositories/cloud/SyncQueueRepository';
import CloudProviderRegistry from './CloudProviderRegistry';
import * as Crypto from 'expo-crypto';

class CloudSyncService {
  async queueOperation(entityType, entityId, operation, payload, priority = 1) {
    const uuid = Crypto.randomUUID();
    return SyncQueueRepository.create({
      uuid,
      entityType,
      entityId: entityId ? String(entityId) : null,
      operation,
      payload: payload ? JSON.stringify(payload) : null,
      status: 'pending',
      retryCount: 0,
      priority,
    });
  }

  async processQueue() {
    const pendingItems = await SyncQueueRepository.findBy({ status: 'pending' }, { orderBy: 'priority DESC, createdAt ASC' });

    if (pendingItems.length === 0) return;

    const provider = CloudProviderRegistry.getActiveProvider();
    if (!provider) {
      console.warn('No active cloud provider registered for syncing');
      return;
    }

    for (const item of pendingItems) {
      try {
        await SyncQueueRepository.update(item.id, { status: 'processing' });

        // Let the provider handle the actual upstream API calls
        await provider.syncOperation(item.operation, JSON.parse(item.payload));

        // Mark as completed
        await SyncQueueRepository.update(item.id, { status: 'completed' });
      } catch (error) {
        console.error(`Failed to sync item ${item.id}`, error);
        await SyncQueueRepository.update(item.id, {
          status: 'failed',
          retryCount: item.retryCount + 1
        });
      }
    }
  }
}

export default new CloudSyncService();
