import { LegalHoldRepository } from '../../database/repositories/enterprise/LegalHoldRepository';
import { LegalHoldDocumentRepository } from '../../database/repositories/enterprise/LegalHoldDocumentRepository';

export class LegalHoldService {
  constructor() {
    this.holdRepo = new LegalHoldRepository();
    this.holdDocRepo = new LegalHoldDocumentRepository();
  }

  async createHold(data) {
    return await this.holdRepo.create(data);
  }

  async addDocumentToHold(legalHoldId, documentId, userId) {
    return await this.holdDocRepo.create({
      legalHoldId,
      documentId,
      addedAt: new Date().toISOString(),
      addedBy: userId
    });
  }
}

export const legalHoldService = new LegalHoldService();
