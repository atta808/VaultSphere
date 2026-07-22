import DocumentRelationshipRepository from '../../../database/repositories/knowledge/DocumentRelationshipRepository';
import SemanticIndexRepository from '../../../database/repositories/knowledge/SemanticIndexRepository';
import SimilarityEngine from './SimilarityEngine';
import { Logger } from '../../../utils/logger/Logger';

class DocumentRelationshipService {
  async addManualRelationship(sourceId, targetId, relationshipType, metadata = {}) {
    return DocumentRelationshipRepository.create({
      sourceDocumentId: sourceId,
      targetDocumentId: targetId,
      relationshipType,
      isManual: 1,
      confidenceScore: 1.0,
      metadata: JSON.stringify(metadata)
    });
  }

  async detectSimilarDocuments(documentId) {
    try {
      const sourceChunks = await SemanticIndexRepository.getDocumentChunksWithEmbeddings(documentId);
      if (!sourceChunks || sourceChunks.length === 0) return;

      const sourceVectors = sourceChunks
          .map(c => { try { return JSON.parse(c.embeddingData); } catch(e) { return null; }})
          .filter(v => v !== null);

      if (sourceVectors.length === 0) return;

      // Find other docs
      const allChunks = await SemanticIndexRepository.getAllChunksWithEmbeddings();

      const docVectors = new Map(); // docId -> vectors[]
      for (const chunk of allChunks) {
          if (chunk.documentId === documentId) continue; // Skip self
          let vec;
          try { vec = JSON.parse(chunk.embeddingData); } catch(e) { continue; }

          if (!docVectors.has(chunk.documentId)) {
              docVectors.set(chunk.documentId, []);
          }
          docVectors.get(chunk.documentId).push(vec);
      }

      for (const [targetDocId, targetVectors] of docVectors.entries()) {
          const score = SimilarityEngine.computeDocumentSimilarity(sourceVectors, targetVectors);

          if (score > 0.85) { // High threshold for similarity
              // Check if relationship exists
              const existing = await DocumentRelationshipRepository.find(
                  '(sourceDocumentId = ? AND targetDocumentId = ?) OR (sourceDocumentId = ? AND targetDocumentId = ?)',
                  [documentId, targetDocId, targetDocId, documentId]
              );

              if (existing.length === 0) {
                  await DocumentRelationshipRepository.create({
                      sourceDocumentId: documentId,
                      targetDocumentId: targetDocId,
                      relationshipType: score > 0.95 ? 'duplicate' : 'similar',
                      confidenceScore: score,
                      isManual: 0
                  });
              }
          }
      }
    } catch (e) {
      Logger.error(`Error detecting similar documents for ${documentId}`, e);
    }
  }
}

export default new DocumentRelationshipService();
