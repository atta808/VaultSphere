import { ReadingPositionRepository } from '../../database/repositories/ReadingPositionRepository';

export class RecentPositionService {
  constructor() {
    this.positionRepo = new ReadingPositionRepository();
  }

  async getPosition(documentId) {
    return await this.positionRepo.getByDocumentId(documentId);
  }

  async savePosition(documentId, positionData) {
    const data = {
      ...positionData,
      documentId,
      lastOpenedAt: new Date().toISOString()
    };
    return await this.positionRepo.savePosition(data);
  }
}

export default new RecentPositionService();
