import RecommendationRepository from '../../../database/repositories/knowledge/RecommendationRepository';
import DocumentRelationshipRepository from '../../../database/repositories/knowledge/DocumentRelationshipRepository';

class RecommendationService {
  async getRecommendationsForDocument(documentId) {
    // Phase 18: Recommendations driven by detected relationships and topics
    const relsSource = await DocumentRelationshipRepository.findBySource(documentId);
    const relsTarget = await DocumentRelationshipRepository.findByTarget(documentId);

    const relatedDocs = new Set();
    relsSource.forEach(r => relatedDocs.add(r.targetDocumentId));
    relsTarget.forEach(r => relatedDocs.add(r.sourceDocumentId));

    const recommendations = Array.from(relatedDocs).map(id => ({
        type: 'similar_document',
        documentId: id,
        reason: 'Based on content similarity'
    }));

    return recommendations;
  }
}

export default new RecommendationService();
