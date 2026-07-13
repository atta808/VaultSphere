import BaseRepository from './BaseRepository';

class DocumentKeywordRepository extends BaseRepository {
  constructor() {
    super('document_keywords');
  }
}

export default new DocumentKeywordRepository();
