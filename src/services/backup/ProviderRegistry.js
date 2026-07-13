import LocalStorageProvider from './providers/LocalStorageProvider';
import FutureProvider from './providers/FutureProvider';

class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.registerDefaultProviders();
  }

  registerDefaultProviders() {
    this.registerProvider('local', LocalStorageProvider);
    this.registerProvider('google_drive', FutureProvider);
    this.registerProvider('dropbox', FutureProvider);
    this.registerProvider('onedrive', FutureProvider);
    this.registerProvider('icloud', FutureProvider);
  }

  registerProvider(id, providerInstance) {
    this.providers.set(id, providerInstance);
  }

  getProvider(id) {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider ${id} is not registered.`);
    }
    return provider;
  }

  getAllProviders() {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      name: provider.name || id,
      isConfigured: provider.isConfigured ? provider.isConfigured() : false,
    }));
  }
}

export default new ProviderRegistry();
