import { RecordRepository } from '../../database/repositories/enterprise/RecordRepository';

export class RecordsManagementService {
  constructor() {
    this.recordRepo = new RecordRepository();
  }

  async declareRecord(documentId, recordSeriesId, userId) {
    // This implements the explicit declaration workflow
    return await this.recordRepo.create({
      documentId,
      recordSeriesId,
      status: 'Active',
      declaredAt: new Date().toISOString(),
      declaredBy: userId
    });
  }

  async getRecordByDocumentId(documentId) {
    const records = await this.recordRepo.findBy({ documentId, deletedAt: null });
    return records.length > 0 ? records[0] : null;
  }
}

export const recordsManagementService = new RecordsManagementService();
