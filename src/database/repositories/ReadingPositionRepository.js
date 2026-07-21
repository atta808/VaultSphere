import BaseRepository from './BaseRepository';

export class ReadingPositionRepository extends BaseRepository {
  constructor() {
    super('reading_positions');
  }

  async getByDocumentId(documentId) {
    const results = await this.findAll({ where: { documentId } });
    return results.length > 0 ? results[0] : null;
  }

  async savePosition(positionData) {
    const existing = await this.getByDocumentId(positionData.documentId);
    if (existing) {
      // Assuming BaseRepository doesn't automatically support updating with primary key other than `id`,
      // we might need a custom update query or to ensure `BaseRepository.update` handles it.
      // `BaseRepository` update uses `{ id }` as condition.
      // Since `reading_positions` primary key is `documentId`, let's use `updateMany` for safety.
      await this.updateMany({ documentId: positionData.documentId }, positionData);
      return positionData;
    }
    return this.create(positionData);
  }
}
