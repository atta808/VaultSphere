import ProviderRegistry from '../providers/ProviderRegistry';
import DocumentEntityRepository from '../../database/repositories/DocumentEntityRepository';
import DocumentKeywordRepository from '../../database/repositories/DocumentKeywordRepository';
import DocumentClassificationService from './DocumentClassificationService';
import DocumentSummaryService from './DocumentSummaryService';
import { AIAnalysisError } from '../errors';

class AIAnalysisService {
  async analyzeDocument(documentId, ocrText) {
    if (!ocrText) return null;

    try {
      const provider = ProviderRegistry.getAnalysisProvider();
      const analysisData = await provider.analyze(ocrText);

      // Save classification
      await DocumentClassificationService.saveClassification(documentId, analysisData);

      // Save summary
      await DocumentSummaryService.saveSummary(documentId, analysisData.summary || {});

      // Save entities
      if (analysisData.entities && Array.isArray(analysisData.entities)) {
        const entityRecords = analysisData.entities.map(e => ({
          documentId,
          type: e.type,
          value: e.value,
          confidence: e.confidence || null
        }));
        await DocumentEntityRepository.createMany(entityRecords);
      }

      // Save keywords
      if (analysisData.keywords && Array.isArray(analysisData.keywords)) {
        const keywordRecords = analysisData.keywords.map(k => ({
          documentId,
          keyword: k.keyword,
          type: k.type
        }));
        await DocumentKeywordRepository.createMany(keywordRecords);
      }

      return analysisData;

    } catch (error) {
      if (error instanceof AIAnalysisError) throw error;
      throw new AIAnalysisError('Failed to analyze document', error);
    }
  }
}

export default new AIAnalysisService();
