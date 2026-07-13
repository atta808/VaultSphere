import BaseRepository from './BaseRepository';

class DocumentEntityRepository extends BaseRepository {
  constructor() {
    super('document_entities');
  }
}

export default new DocumentEntityRepository();
