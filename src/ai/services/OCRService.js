import ProviderRegistry from '../providers/ProviderRegistry';
import OCRResultRepository from '../../database/repositories/OCRResultRepository';
import { OCRProcessingError } from '../errors';
import * as FileSystem from 'expo-file-system';

class OCRService {
  /**
   * Process a document image for OCR
   */
  async processImage(documentId, imagePath, mimeType) {
    try {
      const provider = ProviderRegistry.getOCRProvider();

      // Read file as base64
      let baseFileContent;
      try {
        baseFileContent = await FileSystem.readAsStringAsync(imagePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        throw new OCRProcessingError(`Failed to read file at ${imagePath}`, err);
      }

      // Analyze with provider
      const result = await provider.analyze(baseFileContent, mimeType);

      // Apply normalization strategy
      let normalizedText = result.text || '';
      normalizedText = this.normalizeText(normalizedText);

      // Save result to db
      const savedResult = await OCRResultRepository.create({
        documentId,
        text: normalizedText,
        confidence: result.confidence || null,
        processingTime: result.processingTime || 0,
        provider: result.provider
      });

      return savedResult;
    } catch (error) {
      if (error instanceof OCRProcessingError) throw error;
      throw new OCRProcessingError('Failed to process image OCR', error);
    }
  }

  normalizeText(text) {
    if (!text) return '';
    let processed = text;
    // Example basic normalizations as defined in OCRPrompt strategy conceptually
    processed = processed.replace(/\n{3,}/g, '\n\n'); // Remove multiple consecutive newlines
    processed = processed.trim();
    return processed;
  }
}

export default new OCRService();
