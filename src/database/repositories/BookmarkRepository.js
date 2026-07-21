import BaseRepository from './BaseRepository';

export class BookmarkRepository extends BaseRepository {
  constructor() {
    super('document_bookmarks');
  }

  async getBookmarksForDocument(documentId) {
    return this.findAll({ where: { documentId }, orderBy: 'pageNumber ASC' });
  }
}
