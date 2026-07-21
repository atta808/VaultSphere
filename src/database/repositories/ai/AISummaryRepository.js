import BaseRepository from '../BaseRepository';

export class AISummaryRepository extends BaseRepository {
  constructor() {
    super('ai_summaries');
    this.hasSoftDeletes = true;
  }

  async saveSummary(documentId, summaryText, keyPoints) {
    const now = Date.now();
    return await this.create({
      id: this.generateUUID(),
      documentId,
      summaryText,
      keyPoints: keyPoints ? JSON.stringify(keyPoints) : null,
      generatedAt: now,
    });
  }
}
