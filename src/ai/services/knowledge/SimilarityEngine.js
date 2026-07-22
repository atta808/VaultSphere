/**
 * Javascript based similarity engine for calculating cosine similarities
 */
class SimilarityEngine {
  /**
   * Calculates the cosine similarity between two vectors.
   * @param {number[]} vecA
   * @param {number[]} vecB
   * @returns {number} Value between -1 and 1.
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      throw new Error('Vectors must be defined and of the same length.');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Find top K similar items to a target vector from an array of candidates.
   * @param {number[]} targetVector
   * @param {Array<{id: any, vector: number[], [key:string]: any}>} candidates
   * @param {number} topK
   * @param {number} threshold
   * @returns {Array<{item: any, score: number}>}
   */
  findTopSimilar(targetVector, candidates, topK = 5, threshold = 0.5) {
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;
      try {
        score = this.cosineSimilarity(targetVector, candidate.vector);
      } catch (e) {
        // Log or handle error if vector dimensions don't match
      }
      return { item: candidate, score };
    });

    return scoredCandidates
      .filter(c => c.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Compare two sets of vectors to determine if documents are duplicates/similar
   * Basic heuristic: compare average of chunks or max similarity between chunks.
   */
  computeDocumentSimilarity(docAVectors, docBVectors) {
    if (!docAVectors.length || !docBVectors.length) return 0;

    let maxSim = 0;
    for (const vecA of docAVectors) {
      for (const vecB of docBVectors) {
        const sim = this.cosineSimilarity(vecA, vecB);
        if (sim > maxSim) maxSim = sim;
      }
    }
    return maxSim; // Returning the maximum overlap as the document similarity score
  }
}

export default new SimilarityEngine();
