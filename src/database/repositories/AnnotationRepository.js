import BaseRepository from './BaseRepository';

export class AnnotationRepository extends BaseRepository {
  constructor() {
    super('document_annotations');
  }

  async getAnnotationsForDocument(documentId) {
    return this.findAll({ where: { documentId }, orderBy: 'pageNumber ASC, createdAt DESC' });
  }
}
