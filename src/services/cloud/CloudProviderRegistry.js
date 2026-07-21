class CloudProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.activeProviderId = null;
  }

  registerProvider(id, providerInstance) {
    this.providers.set(id, providerInstance);
  }

  setActiveProvider(id) {
    if (!this.providers.has(id)) {
      throw new Error(`Provider ${id} not registered`);
    }
    this.activeProviderId = id;
  }

  getActiveProvider() {
    return this.providers.get(this.activeProviderId);
  }
}

export default new CloudProviderRegistry();
