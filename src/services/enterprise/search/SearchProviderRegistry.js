import { Logger } from '../../../utils/logger/Logger';

/**
 * Search Provider Registry
 * Manages the lifecycle and resolution of active search providers.
 */
class Registry {
  constructor() {
    this.providers = new Map();
  }

  async initialize() {
    Logger.info('Initializing SearchProviderRegistry...');

    // Lazy load to prevent circular dependencies at boot
    const { LocalVaultSearchProvider } = require('./providers/LocalVaultSearchProvider');
    const { SemanticSearchProvider } = require('./providers/SemanticSearchProvider');
    const { KnowledgeGraphSearchProvider } = require('./providers/KnowledgeGraphSearchProvider');
    const { MockExternalSearchProvider } = require('./providers/MockExternalSearchProvider');

    this.registerProvider(new LocalVaultSearchProvider());
    this.registerProvider(new SemanticSearchProvider());
    this.registerProvider(new KnowledgeGraphSearchProvider());
    this.registerProvider(new MockExternalSearchProvider());
  }

  registerProvider(providerInstance) {
    const metadata = providerInstance.getMetadata();
    if (this.providers.has(metadata.id)) {
      Logger.warn(`Search Provider ${metadata.id} already registered.`);
      return;
    }

    this.providers.set(metadata.id, providerInstance);
    Logger.info(`Registered Search Provider: ${metadata.name} (v${metadata.version})`);
  }

  getProvider(providerId) {
    return this.providers.get(providerId);
  }

  getActiveProviders() {
    return Array.from(this.providers.values()).filter(p => p.isActive());
  }
}

export const SearchProviderRegistry = new Registry();
