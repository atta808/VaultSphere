import ProviderRegistry from '../../providers/ProviderRegistry';
import EmbeddingRepository from '../../../database/repositories/knowledge/EmbeddingRepository';
import { Logger } from '../../../utils/logger/Logger';

class EmbeddingService {
  /**
   * Generate embeddings for a text chunk and optionally save them.
   */
  async generateAndSaveEmbedding(targetId, targetType, text) {
    try {
      const provider = ProviderRegistry.getEmbeddingProvider();
      const embeddings = await provider.generateEmbeddings(text);

      if (!embeddings || embeddings.length === 0) {
          throw new Error('No embeddings returned from provider.');
      }

      const embeddingData = embeddings[0]; // Assuming one text input
      const serializedData = JSON.stringify(embeddingData);

      const savedEmbedding = await EmbeddingRepository.create({
        targetId: String(targetId),
        targetType,
        embeddingData: serializedData,
        modelName: provider.getModelName(),
        provider: provider.getProviderName()
      });

      return savedEmbedding;
    } catch (error) {
      Logger.error(`Failed to generate and save embedding for ${targetType} ${targetId}`, error);
      throw error;
    }
  }

  async generateEmbedding(text) {
      const provider = ProviderRegistry.getEmbeddingProvider();
      const embeddings = await provider.generateEmbeddings(text);
      if (!embeddings || embeddings.length === 0) return null;
      return embeddings[0];
  }
}

export default new EmbeddingService();
