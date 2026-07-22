import { DeviceEventEmitter } from 'react-native';
import { SyncQueueService } from '../cloud/SyncQueueService';
import { Logger } from '../../utils/logger/Logger';

/**
 * Service to handle synchronization of enterprise governance entities.
 * Following the offline-first architecture, it queues operations into the
 * SyncQueue for CloudSyncService to process.
 */
export class GovernanceSyncService {
  constructor() {
    this.syncQueue = new SyncQueueService();
    this.setupListeners();
  }

  setupListeners() {
    // Listen for governance events to queue sync tasks
    DeviceEventEmitter.addListener('GOVERNANCE_RECORD_DECLARED', this.handleRecordDeclared.bind(this));
    DeviceEventEmitter.addListener('GOVERNANCE_POLICY_CREATED', this.handlePolicyCreated.bind(this));
    // Additional events for legal holds, classifications, etc.
  }

  async handleRecordDeclared(payload) {
    try {
      await this.syncQueue.enqueue({
        domain: 'governance',
        entityType: 'record',
        entityId: payload.uuid,
        operation: 'CREATE',
        payload: payload
      });
      Logger.info(`Queued record declaration for sync: ${payload.uuid}`);
    } catch (error) {
      Logger.error(`Failed to queue record declaration sync: ${error.message}`);
    }
  }

  async handlePolicyCreated(payload) {
    try {
      await this.syncQueue.enqueue({
        domain: 'governance',
        entityType: 'retention_policy',
        entityId: payload.uuid,
        operation: 'CREATE',
        payload: payload
      });
      Logger.info(`Queued policy creation for sync: ${payload.uuid}`);
    } catch (error) {
      Logger.error(`Failed to queue policy creation sync: ${error.message}`);
    }
  }

  // Method to manually queue any governance operation
  async queueGovernanceOperation(entityType, entityId, operation, payload) {
    return await this.syncQueue.enqueue({
      domain: 'governance',
      entityType,
      entityId,
      operation,
      payload
    });
  }
}

export const governanceSyncService = new GovernanceSyncService();
