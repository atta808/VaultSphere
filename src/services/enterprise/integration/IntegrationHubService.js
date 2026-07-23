import { Logger } from '../../../utils/logger/Logger';
import { ConnectorRegistry } from './ConnectorRegistry';
import { ConnectorManagerService } from './ConnectorManagerService';
import { IntegrationMonitoringService } from './IntegrationMonitoringService';
import { WebhookService } from './WebhookService';
import { ApiGatewayService } from './ApiGatewayService';

/**
 * Enterprise Integration Hub Service
 * Acts as the central facade for the entire integration architecture,
 * orchestrating connectors, webhooks, and APIs.
 */
class IntegrationHubService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      Logger.info('Initializing IntegrationHubService...');

      // Initialize core dependencies
      await ConnectorRegistry.initialize();
      await ConnectorManagerService.initialize();
      await WebhookService.initialize();
      await ApiGatewayService.initialize();
      await IntegrationMonitoringService.initialize();

      this.isInitialized = true;
      Logger.info('IntegrationHubService initialized successfully.');
    } catch (error) {
      Logger.error('Failed to initialize IntegrationHubService', error);
      throw error;
    }
  }

  async getHealthStatus() {
    return await IntegrationMonitoringService.getGlobalHealth();
  }
}

export default new IntegrationHubService();
