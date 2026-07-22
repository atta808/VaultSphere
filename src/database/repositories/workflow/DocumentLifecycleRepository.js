import BaseRepository from '../BaseRepository';

export class DocumentLifecycleRepository extends BaseRepository {
  constructor() {
    super('document_lifecycle');
  }

  async findByDocumentId(documentId) {
    return this.db.getAllAsync('SELECT * FROM document_lifecycle WHERE documentId = ? ORDER BY changedAt DESC', [documentId]);
  }

  async getLatestState(documentId) {
    const states = await this.db.getAllAsync('SELECT * FROM document_lifecycle WHERE documentId = ? ORDER BY changedAt DESC LIMIT 1', [documentId]);
    return states.length > 0 ? states[0] : null;
  }
}

export default new DocumentLifecycleRepository();
