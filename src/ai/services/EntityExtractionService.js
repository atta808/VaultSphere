import { PromptBuilderService } from './PromptBuilderService';
import ProviderRegistry from '../providers/ProviderRegistry';
import { AIEntityRepository } from '../../database/repositories/ai/AIEntityRepository';

class EntityExtractionService {
  constructor() {
    this.entityRepo = new AIEntityRepository();
  }

  async extractEntities(documentId, ocrText) {
    if (!ocrText || ocrText.trim() === '') return [];

    const provider = ProviderRegistry.getAnalysisProvider();
    const prompt = PromptBuilderService.buildActionPrompt('extract', ocrText);

    const response = await provider.generateContent(prompt, {
      generationConfig: { responseMimeType: "application/json" }
    });

    try {
      const entities = JSON.parse(response.text);
      if (Array.isArray(entities)) {
        await this.entityRepo.clearEntitiesForDocument(documentId);
        await this.entityRepo.saveEntities(documentId, entities);
        return entities;
      }
    } catch (e) {
      console.error('Failed to parse entities from AI provider', e);
    }

    return [];
  }
}

export default new EntityExtractionService();
