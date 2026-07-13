import DocumentAnalysisRepository from '../../database/repositories/DocumentAnalysisRepository';

class DocumentClassificationService {
  async saveClassification(documentId, classificationData) {
    return DocumentAnalysisRepository.create({
      documentId,
      classification: classificationData.classification,
      confidence: classificationData.classificationConfidence || null,
      provider: 'gemini'
    });
  }
}

export default new DocumentClassificationService();
