import BaseRepository from '../BaseRepository';

export class AIComparisonRepository extends BaseRepository {
  constructor() {
    super('ai_comparisons');
    this.hasSoftDeletes = true;
  }

  async saveComparison(data) {
    const now = Date.now();
    return await this.create({
      id: this.generateUUID(),
      documentAId: data.documentAId,
      documentBId: data.documentBId,
      similarityScore: data.similarityScore,
      changeSummary: data.changeSummary,
      diffData: data.diffData ? JSON.stringify(data.diffData) : null,
      comparedAt: now,
    });
  }
}
