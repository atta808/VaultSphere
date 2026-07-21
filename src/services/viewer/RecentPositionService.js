import { ReadingPositionRepository } from '../../database/repositories/ReadingPositionRepository';

export class RecentPositionService {
  constructor() {
    this.positionRepo = new ReadingPositionRepository();
  }

  async getPosition(documentId) {
    return await this.positionRepo.getByDocumentId(documentId);
  }

  async savePosition(documentId, positionData) {
    const existing = await this.getPosition(documentId);
    let durationSeconds = positionData.durationSeconds || 0;

    if (existing && positionData.sessionDuration) {
      durationSeconds = (existing.durationSeconds || 0) + positionData.sessionDuration;
    }

    const data = {
      ...positionData,
      documentId,
      durationSeconds,
      lastOpenedAt: new Date().toISOString()
    };
    delete data.sessionDuration; // Ensure it doesn't go to DB

    return await this.positionRepo.savePosition(data);
  }
}

export default new RecentPositionService();
