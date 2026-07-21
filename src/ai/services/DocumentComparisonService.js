import { diffWords } from 'diff';
import { PromptBuilderService } from './PromptBuilderService';
import ProviderRegistry from '../providers/ProviderRegistry';
import { AIComparisonRepository } from '../../database/repositories/ai/AIComparisonRepository';

class DocumentComparisonService {
  constructor() {
    this.comparisonRepo = new AIComparisonRepository();
  }

  /**
   * Normalizes text by trimming and standardizing spaces.
   */
  _normalizeText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  async compareDocuments(docAId, textA, docBId, textB) {
    const normalizedA = this._normalizeText(textA);
    const normalizedB = this._normalizeText(textB);

    // 1. Calculate local diff
    const diffResult = diffWords(normalizedA, normalizedB);

    let additions = 0;
    let deletions = 0;
    let totalWords = 0;

    const diffData = diffResult.map(part => {
      const count = part.count || 0;
      if (part.added) additions += count;
      if (part.removed) deletions += count;
      if (!part.removed) totalWords += count;
      return {
        value: part.value,
        added: part.added,
        removed: part.removed
      };
    });

    const maxLen = Math.max(normalizedA.length, normalizedB.length, 1);
    const unchangedLen = maxLen - (additions + deletions);
    const similarityScore = Math.max(0, unchangedLen / maxLen);

    // 2. Generate AI Summary of changes
    let changeSummary = 'Documents are identical.';
    if (additions > 0 || deletions > 0) {
      // Build a minimal representation of changes for the AI prompt to save tokens
      const changesForPrompt = diffData
        .filter(d => d.added || d.removed)
        .map(d => `${d.added ? 'ADDED' : 'REMOVED'}: ${d.value}`)
        .join('\n');

      const provider = ProviderRegistry.getAnalysisProvider();
      const prompt = PromptBuilderService.buildActionPrompt('compare', changesForPrompt);
      try {
        const response = await provider.generateContent(prompt);
        changeSummary = response.text;
      } catch (e) {
        console.warn('Failed to generate change summary from AI', e);
        changeSummary = `Found ${additions} additions and ${deletions} deletions.`;
      }
    }

    // 3. Save to database
    const savedComparison = await this.comparisonRepo.saveComparison({
      documentAId: docAId,
      documentBId: docBId,
      similarityScore,
      changeSummary,
      diffData,
    });

    return {
      id: savedComparison.id,
      similarityScore,
      changeSummary,
      diffData,
      stats: { additions, deletions }
    };
  }
}

export default new DocumentComparisonService();
