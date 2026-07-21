import BaseRepository from '../BaseRepository';

class SharedDocumentRepository extends BaseRepository {
  constructor() {
    super('shared_documents');
    this.hasSoftDeletes = true;
  }
}

export default new SharedDocumentRepository();
