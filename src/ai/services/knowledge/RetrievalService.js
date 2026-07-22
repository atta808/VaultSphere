import SemanticSearchService from './SemanticSearchService';
import CitationService from '../CitationService';

/**
 * Service responsible for Retrieval-Augmented Generation (RAG) preparation.
 */
class RetrievalService {
  /**
   * Retrieves relevant chunks for a given query and builds a context string.
   */
  async buildContextForQuery(query, topK = 3) {
    const searchResults = await SemanticSearchService.search(query, { limit: topK, threshold: 0.6 });

    if (searchResults.length === 0) {
      return { context: '', citations: [] };
    }

    let contextBuilder = [];
    let citations = [];

    searchResults.forEach((res, index) => {
      // Chunk format for prompt
      const chunkText = `[Doc ${res.documentId}, Page ${res.pageNumber || 'Unknown'}]: ${res.bestChunk}`;
      contextBuilder.push(chunkText);

      citations.push({
        id: index + 1,
        documentId: res.documentId,
        pageNumber: res.pageNumber,
        textSnippet: res.bestChunk.substring(0, 50) + '...'
      });
    });

    return {
      context: contextBuilder.join('\n\n'),
      citations
    };
  }
}

export default new RetrievalService();
