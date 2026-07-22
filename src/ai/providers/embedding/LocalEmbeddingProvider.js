import EmbeddingProvider from './EmbeddingProvider';
import { Logger } from '../../../utils/logger/Logger';

export default class LocalEmbeddingProvider extends EmbeddingProvider {
  constructor() {
    super();
    this.modelName = 'local-embedding-model';
    this.providerName = 'Local';
  }

  async generateEmbeddings(text) {
    Logger.warn('Local embedding generation is not yet implemented. Returning empty embeddings.');
    const texts = Array.isArray(text) ? text : [text];
    // Return dummy vector of 0s to represent not implemented, or throw if preferred.
    return texts.map(() => new Array(768).fill(0));
  }

  getModelName() {
    return this.modelName;
  }

  getProviderName() {
    return this.providerName;
  }
}
