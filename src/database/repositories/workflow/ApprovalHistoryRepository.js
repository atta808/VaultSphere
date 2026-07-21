import BaseRepository from '../BaseRepository';

export class ApprovalHistoryRepository extends BaseRepository {
  constructor() {
    super('approval_history');
  }

  async findByApprovalId(approvalId) {
    return this.db.getAllAsync('SELECT * FROM approval_history WHERE approvalId = ? ORDER BY timestamp DESC', [approvalId]);
  }
}

export default new ApprovalHistoryRepository();
