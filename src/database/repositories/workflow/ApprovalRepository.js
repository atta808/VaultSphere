import BaseRepository from '../BaseRepository';

export class ApprovalRepository extends BaseRepository {
  constructor() {
    super('approvals');
    this.hasSoftDeletes = true;
  }

  async findByInstanceId(instanceId) {
    return this.db.getAllAsync('SELECT * FROM approvals WHERE workflowInstanceId = ? AND deletedAt IS NULL', [instanceId]);
  }

  async findByDocumentId(documentId) {
    return this.db.getAllAsync('SELECT * FROM approvals WHERE documentId = ? AND deletedAt IS NULL', [documentId]);
  }

  async findPendingByApprover(approverId) {
    return this.db.getAllAsync('SELECT * FROM approvals WHERE approverId = ? AND status = ? AND deletedAt IS NULL', [approverId, 'pending']);
  }
}

export default new ApprovalRepository();
