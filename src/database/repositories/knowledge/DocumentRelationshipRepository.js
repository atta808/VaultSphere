import BaseRepository from '../BaseRepository';

class DocumentRelationshipRepository extends BaseRepository {
  constructor() {
    super('document_relationships');
  }

  async findBySource(sourceDocumentId) {
    return this.find('sourceDocumentId = ?', [sourceDocumentId]);
  }

  async findByTarget(targetDocumentId) {
    return this.find('targetDocumentId = ?', [targetDocumentId]);
  }
}

export default new DocumentRelationshipRepository();
