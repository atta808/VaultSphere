import SemanticIndexRepository from '../../../database/repositories/knowledge/SemanticIndexRepository';
import SimilarityEngine from './SimilarityEngine';
import EmbeddingService from './EmbeddingService';
import { Logger } from '../../../utils/logger/Logger';

class VectorIndexService {
  /**
   * Search across all stored chunks in the database
   */
  async searchSimilarChunks(queryText, topK = 5, threshold = 0.6) {
    try {
      const queryVector = await EmbeddingService.generateEmbedding(queryText);
      if (!queryVector) return [];

      // Note: For production with millions of chunks, loading everything into memory is bad.
      // Since SQLite doesn't natively support vector ops in this phase, we do an in-memory pass.
      // Future phase: sqlite-vec or HNSW local index.
      const allChunks = await SemanticIndexRepository.getAllChunksWithEmbeddings();

      const candidates = allChunks
        .filter(chunk => chunk.embeddingData)
        .map(chunk => {
          let vector = [];
          try {
            vector = JSON.parse(chunk.embeddingData);
          } catch(e) {}
          return { ...chunk, vector };
        })
        .filter(c => c.vector.length > 0);

      const results = SimilarityEngine.findTopSimilar(queryVector, candidates, topK, threshold);
      return results.map(r => ({
          chunk: r.item,
          score: r.score
      }));
    } catch (error) {
      Logger.error('Error during vector index search', error);
      throw error;
    }
  }
}

export default new VectorIndexService();
