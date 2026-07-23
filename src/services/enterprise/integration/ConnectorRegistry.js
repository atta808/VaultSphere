import { Logger } from '../../../utils/logger/Logger';
import { MockRestConnector } from './connectors/MockRestConnector';

/**
 * Connector Registry
 * Holds all available connector implementations for the platform.
 */
class Registry {
  constructor() {
    this.connectors = new Map();
  }

  async initialize() {
    Logger.info('Initializing ConnectorRegistry...');
    this.registerConnector(new MockRestConnector());
    // Future connectors will be registered here
    // this.registerConnector(new GoogleDriveConnector());
    // this.registerConnector(new OneDriveConnector());
  }

  registerConnector(connectorInstance) {
    const metadata = connectorInstance.getMetadata();
    if (this.connectors.has(metadata.id)) {
      Logger.warn(`Connector with ID ${metadata.id} is already registered.`);
      return;
    }

    this.connectors.set(metadata.id, connectorInstance);
    Logger.info(`Registered connector: ${metadata.name} (v${metadata.version})`);
  }

  getConnector(connectorId) {
    return this.connectors.get(connectorId);
  }

  getAllConnectors() {
    return Array.from(this.connectors.values());
  }
}

export const ConnectorRegistry = new Registry();
