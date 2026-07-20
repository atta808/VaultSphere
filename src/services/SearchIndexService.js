import SearchIndexRepository from '../database/repositories/SearchIndexRepository';
import DocumentRepository from '../database/repositories/DocumentRepository';
import OCRResultRepository from '../database/repositories/OCRResultRepository';
import DocumentKeywordRepository from '../database/repositories/DocumentKeywordRepository';
import DocumentEntityRepository from '../database/repositories/DocumentEntityRepository';
import DocumentSummaryRepository from '../database/repositories/DocumentSummaryRepository';
import TagRepository from '../database/repositories/TagRepository';
import { Logger } from '../utils/logger/Logger';

class SearchIndexService {
  /**
   * Rebuilds the search index for a specific document by pulling from all relevant tables.
   */
  async indexDocument(documentId) {
    try {
      const doc = await DocumentRepository.findById(documentId);
      if (!doc || doc.deletedAt) {
        // If deleted or not found, remove from index
        await SearchIndexRepository.deleteByDocumentId(documentId);
        return;
      }

      // Gather OCR data
      const ocrResults = await OCRResultRepository.findByDocumentId(documentId);
      const ocrText = ocrResults.map(r => r.text).join(' ');

      // Gather AI data
      const keywords = await DocumentKeywordRepository.findByDocumentId(documentId);
      const aiKeywords = keywords.map(k => k.keyword).join(' ');

      const entities = await DocumentEntityRepository.findByDocumentId(documentId);
      const aiEntities = entities.map(e => e.value).join(' ');

      const summary = await DocumentSummaryRepository.findByDocumentId(documentId);
      const aiSummary = summary ? [summary.shortSummary, summary.mediumSummary, summary.longSummary].filter(Boolean).join(' ') : '';

      // Gather Tags
      const tags = await TagRepository.findByDocumentId(documentId);
      const tagString = tags.map(t => t.name).join(' ');

      // Upsert into FTS
      await SearchIndexRepository.upsertIndex(documentId, {
        filename: doc.name || doc.originalName || '',
        ocr: ocrText,
        ai_keywords: aiKeywords,
        ai_entities: aiEntities,
        ai_summary: aiSummary,
        tags: tagString,
        notes: '', // Notes support not fully implemented yet but placeholder exists
        metadata: `${doc.extension} ${doc.mimeType}` // Mime and extension as simple metadata
      });

    } catch (e) {
      Logger.error(`SearchIndexService: Failed to index document ${documentId}`, e);
    }
  }

  /**
   * Complete rebuild of the search index for all documents.
   * Useful for initial migration or maintenance.
   */
  async rebuildAll() {
    try {
      // For now, assume a simple retrieval
      const allDocs = await DocumentRepository.findAll({ includeDeleted: false });

      for (const doc of allDocs) {
        await this.indexDocument(doc.id);
      }
      Logger.info(`Rebuilt search index for ${allDocs.length} documents.`);
    } catch (e) {
      Logger.error(`SearchIndexService: Failed to rebuild all`, e);
    }
  }

  async removeDocument(documentId) {
    await SearchIndexRepository.deleteByDocumentId(documentId);
  }
}

export default new SearchIndexService();
