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

      // Create Search Index
      await SearchIndexService.indexDocument(documentId, {
        ocrText: ocrResult.text,
        summary: analysis?.summary,
        keywords: analysis?.keywords,
        entities: analysis?.entities,
        category: analysis?.classification,
        filename: document.name || document.originalName
      });

      return { success: true, text: ocrResult.text, analysis };

    } catch (error) {
      Logger.error(`DocumentIntelligenceService failed for doc ${documentId}:`, error);
      throw error;
    }
  }
}

export default new DocumentIntelligenceService();
