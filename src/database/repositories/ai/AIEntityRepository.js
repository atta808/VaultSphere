import BaseRepository from '../BaseRepository';

export class AIEntityRepository extends BaseRepository {
  constructor() {
    super('ai_entities');
    this.hasSoftDeletes = true;
  }

  async saveEntities(documentId, entities) {
    const now = Date.now();
    await this.db.withTransactionAsync(async () => {
      for (const entity of entities) {
        await this.create({
          id: this.generateUUID(),
          documentId,
          entityType: entity.type,
          entityValue: entity.value,
          confidence: entity.confidence || 0,
          extractedAt: now,
        });
      }
    });
  }

  async clearEntitiesForDocument(documentId) {
    await this.db.runAsync(`DELETE FROM ai_entities WHERE documentId = ?`, [documentId]);
  }
}
