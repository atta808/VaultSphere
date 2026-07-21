import BaseRepository from '../BaseRepository';

export class WorkflowRepository extends BaseRepository {
  constructor() {
    super('workflows');
    this.hasSoftDeletes = true;
  }

  async findByDocumentId(documentId) {
    return this.db.getAllAsync('SELECT * FROM workflows WHERE documentId = ? AND deletedAt IS NULL', [documentId]);
  }
}

export default new WorkflowRepository();
