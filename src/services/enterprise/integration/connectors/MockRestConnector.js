import { BaseConnector } from './BaseConnector';
import { Logger } from '../../../../utils/logger/Logger';

/**
 * Mock REST API Connector
 * Provides a working reference implementation of the Connector architecture.
 */
export class MockRestConnector extends BaseConnector {
  getMetadata() {
    return {
      id: 'mock-rest-connector',
      name: 'Generic Mock REST API',
      version: '1.0.0',
      type: 'REST API',
      capabilities: ['import', 'export', 'sync', 'webhooks']
    };
  }

  async authenticate(credentials) {
    Logger.info('MockRestConnector: Authenticating with provided credentials');
    return true; // Simulate success
  }

  async checkHealth() {
    Logger.info('MockRestConnector: Checking health');
    return { status: 'healthy', latencyMs: 45 };
  }

  async importData(config) {
    Logger.info('MockRestConnector: Simulating data import');
    return { importedCount: 10, success: true };
  }

  async exportData(config) {
    Logger.info('MockRestConnector: Simulating data export');
    return { exportedCount: 5, success: true };
  }

  async synchronize(state) {
    Logger.info('MockRestConnector: Simulating synchronization');
    return {
      newState: { lastSyncTime: Date.now() },
      changes: []
    };
  }
}
