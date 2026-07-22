/**
 * Interface for Embedding Providers
 */
export default class EmbeddingProvider {
  /**
   * Generates embeddings for the given text.
   * @param {string|string[]} text - Text or array of texts to embed.
   * @returns {Promise<number[][]>} Array of embedding vectors.
   */
  async generateEmbeddings(text) {
    throw new Error('Method not implemented.');
  }

  /**
   * Returns the model name used for embeddings.
   * @returns {string}
   */
  getModelName() {
    throw new Error('Method not implemented.');
  }

  /**
   * Returns the provider name.
   * @returns {string}
   */
  getProviderName() {
    throw new Error('Method not implemented.');
  }
}
