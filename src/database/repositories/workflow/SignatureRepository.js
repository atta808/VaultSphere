import BaseRepository from '../BaseRepository';

export class SignatureRepository extends BaseRepository {
  constructor() {
    super('signatures');
    this.hasSoftDeletes = true;
  }

  async findByDocumentId(documentId) {
    return this.db.getAllAsync('SELECT * FROM signatures WHERE documentId = ? AND deletedAt IS NULL', [documentId]);
  }
}

export default new SignatureRepository();
