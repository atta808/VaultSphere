import VectorIndexService from './VectorIndexService';
import SearchService from '../../../services/SearchService'; // For Hybrid Search

class SemanticSearchService {
  /**
   * Performs a semantic search using vector similarity
   */
  async search(query, options = {}) {
    const topK = options.limit || 10;
    const threshold = options.threshold || 0.5;

    const results = await VectorIndexService.searchSimilarChunks(query, topK, threshold);

    // Group chunks by document, scoring the document by its best chunk
    const docScores = new Map();
    for (const res of results) {
        const docId = res.chunk.documentId;
        if (!docScores.has(docId) || docScores.get(docId).score < res.score) {
            docScores.set(docId, res);
        }
    }

    return Array.from(docScores.values())
        .sort((a, b) => b.score - a.score)
        .map(res => ({
            documentId: res.chunk.documentId,
            bestChunk: res.chunk.text,
            score: res.score,
            pageNumber: res.chunk.pageNumber
        }));
  }

  /**
   * Performs a hybrid search combining FTS keyword search and semantic search
   */
  async hybridSearch(query, options = {}) {
    // 1. Semantic Search
    const semanticResults = await this.search(query, options);

    // 2. Keyword Search
    const keywordResults = await SearchService.search(query, { limit: options.limit });

    // Combine results (Reciprocal Rank Fusion - RRF can be applied here)
    const combinedScores = new Map();

    semanticResults.forEach((res, index) => {
        const rrfScore = 1 / (60 + index); // RRF formula
        combinedScores.set(res.documentId, { ...res, hybridScore: rrfScore });
    });

    keywordResults.forEach((res, index) => {
        const rrfScore = 1 / (60 + index);
        if (combinedScores.has(res.id)) {
            const existing = combinedScores.get(res.id);
            existing.hybridScore += rrfScore;
        } else {
            combinedScores.set(res.id, {
                documentId: res.id,
                score: 0,
                hybridScore: rrfScore
            });
        }
    });

    return Array.from(combinedScores.values())
        .sort((a, b) => b.hybridScore - a.hybridScore);
  }
}

export default new SemanticSearchService();
