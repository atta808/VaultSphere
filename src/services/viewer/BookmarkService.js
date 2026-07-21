import { BookmarkRepository } from '../../database/repositories/BookmarkRepository';

export class BookmarkService {
  constructor() {
    this.bookmarkRepo = new BookmarkRepository();
  }

  async getBookmarks(documentId) {
    return await this.bookmarkRepo.getBookmarksForDocument(documentId);
  }

  async createBookmark(bookmarkData) {
    // Generate UUID if not provided. Base repo create() might generate one.
    if (!bookmarkData.id) {
      bookmarkData.id = this.bookmarkRepo.generateUUID();
    }
    return await this.bookmarkRepo.create(bookmarkData);
  }

  async updateBookmark(id, data) {
    return await this.bookmarkRepo.update(id, data);
  }

  async deleteBookmark(id) {
    // True for hard delete
    return await this.bookmarkRepo.delete(id, true);
  }
}

export default new BookmarkService();
