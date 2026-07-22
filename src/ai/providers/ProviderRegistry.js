class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.defaultOCRProvider = null;
    this.defaultAnalysisProvider = null;
    this.defaultEmbeddingProvider = null;
  }

  registerProvider(id, provider) {
    this.providers.set(id, provider);
  }

  getProvider(id) {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider '${id}' not found in registry.`);
    }
    return provider;
  }

  setDefaultOCRProvider(id) {
    this.defaultOCRProvider = id;
  }

  setDefaultAnalysisProvider(id) {
    this.defaultAnalysisProvider = id;
  }

  getOCRProvider() {
    if (!this.defaultOCRProvider) throw new Error("No default OCR provider set.");
    return this.getProvider(this.defaultOCRProvider);
  }

  getAnalysisProvider() {
    if (!this.defaultAnalysisProvider) throw new Error("No default Analysis provider set.");
    return this.getProvider(this.defaultAnalysisProvider);
  }

  setDefaultEmbeddingProvider(id) {
    this.defaultEmbeddingProvider = id;
  }

  getEmbeddingProvider() {
    if (!this.defaultEmbeddingProvider) throw new Error("No default Embedding provider set.");
    return this.getProvider(this.defaultEmbeddingProvider);
  }
}

export default new ProviderRegistry();
