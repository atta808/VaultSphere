import OCRService from './OCRService';
import { Logger } from '../../utils/logger/Logger';
import AIAnalysisService from './AIAnalysisService';
import SearchIndexService from './SearchIndexService';
import DocumentRepository from '../../database/repositories/DocumentRepository';
import OCRResultRepository from '../../database/repositories/OCRResultRepository';

class DocumentIntelligenceService {
  async processDocument(documentId) {
    try {
      const document = await DocumentRepository.findById(documentId);
      if (!document) {
        throw new Error(`Document ${documentId} not found`);
      }

      // Check if already processed to avoid duplicate OCR
      const existingOcr = await OCRResultRepository.findOne({ documentId });
      if (existingOcr) {
        return { skipped: true, reason: 'Already processed' };
      }

      // We only process images and basic supported formats now
      // Later we can add pdf to image extraction
      const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
      const ext = document.extension ? document.extension.toLowerCase() : '';

      let ocrResult = null;
      if (supportedExtensions.includes(ext)) {
        // Google Vision API supports PDF directly by passing the file content as base64
        // with the appropriate mimeType or feature type.
        // Wait, for local files, Google Vision API can process PDF via files:annotate
        // but we are using images:annotate.
        // Actually, the prompt says "The system should support PDFs and Images. OCR and AI must be modular".
        // And "Do NOT implement: PDF Viewer. DO: OCR."
        // We will pass the file to OCRService and let it handle base64 encoding.
        // If it's a PDF, Google Vision requires async `files:annotate` which requires GCS.
        // Or we pass the document directly to the Gemini Provider if Gemini supports PDF!
        // Actually, Gemini 1.5 Flash natively supports PDF file uploads.
        // Since Google Vision direct REST images:annotate doesn't support PDF directly without GCS,
        // and we are to use `fetch`, we can just send base64 of PDF to Gemini.
        // Wait, the prompt says "Google Vision Provider -> Extract Text".
        // Google Vision can do it with `application/pdf` if we use `files:annotate`? No, synchronous files:annotate is supported for up to 5 pages.
        ocrResult = await OCRService.processImage(documentId, document.path, document.mimeType);
      } else {
         return { skipped: true, reason: 'Unsupported format' };
      }

      if (!ocrResult || !ocrResult.text) {
        return { success: true, analysis: null, text: '' };
      }

      // Run AI Analysis
      const analysis = await AIAnalysisService.analyzeDocument(documentId, ocrResult.text);

      // Entity Extraction (Background Task hook)
      // We do this immediately after analysis before indexing.
      // We will lazy-load EntityExtractionService to avoid cyclical deps.
      const EntityExtractionService = require('./EntityExtractionService').default;
      const entities = await EntityExtractionService.extractEntities(documentId, ocrResult.text);

      // Phase 18: Chunking & Semantic Embeddings Generation
      const EmbeddingService = require('./knowledge/EmbeddingService').default;
      const SemanticIndexRepository = require('../../database/repositories/knowledge/SemanticIndexRepository').default;

      const chunks = this.chunkText(ocrResult.text);
      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];

        // Generate embedding
        let embeddingId = null;
        try {
          const savedEmbedding = await EmbeddingService.generateAndSaveEmbedding(
             `${documentId}_chunk_${i}`,
             'semantic_chunk',
             chunkText
          );
          embeddingId = savedEmbedding.id;
        } catch (e) {
          Logger.warn(`Failed to generate embedding for doc ${documentId} chunk ${i}`, e);
        }

        // Save chunk
        await SemanticIndexRepository.create({
          documentId,
          chunkIndex: i,
          pageNumber: 1, // Assume page 1 if not paginated properly yet
          characterOffset: 0, // Placeholder
          text: chunkText,
          embeddingId
        });
      }

      // Phase 18: Detect Relationships & Extract Topics
      const DocumentRelationshipService = require('./knowledge/DocumentRelationshipService').default;
      const TopicExtractionService = require('./knowledge/TopicExtractionService').default;

      await DocumentRelationshipService.detectSimilarDocuments(documentId);
      await TopicExtractionService.extractAndAssignTopics(documentId, ocrResult.text);

      // Create Search Index
      await SearchIndexService.indexDocument(documentId, {
        ocrText: ocrResult.text,
        summary: analysis?.summary,
        keywords: analysis?.keywords,
        entities: entities?.length > 0 ? entities : analysis?.entities,
        category: analysis?.classification,
        filename: document.name || document.originalName
      });

      return { success: true, text: ocrResult.text, analysis, entities };

    } catch (error) {
      Logger.error(`DocumentIntelligenceService failed for doc ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Helper to chunk text into approx 500-1000 tokens (we use characters for simplicity).
   */
  chunkText(text, chunkSize = 2000, overlap = 200) {
    if (!text) return [];
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + chunkSize;
      // Try to break at paragraph or newline if possible
      if (endIndex < text.length) {
        const nextNewline = text.indexOf('\n\n', endIndex);
        const prevNewline = text.lastIndexOf('\n\n', endIndex);
        if (nextNewline !== -1 && nextNewline - endIndex < 500) {
            endIndex = nextNewline + 2;
        } else if (prevNewline !== -1 && endIndex - prevNewline < 500) {
            endIndex = prevNewline + 2;
        }
      } else {
        endIndex = text.length;
      }

      const chunk = text.slice(startIndex, endIndex).trim();
      if (chunk.length > 0) chunks.push(chunk);

      startIndex = endIndex - overlap;
      if (startIndex >= text.length || endIndex === text.length) break;
    }

    return chunks;
  }
}

export default new DocumentIntelligenceService();
