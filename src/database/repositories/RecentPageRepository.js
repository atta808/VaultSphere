import BaseRepository from './BaseRepository';

export class RecentPageRepository extends BaseRepository {
  constructor() {
    super('recent_pages');
  }

  async getRecentPages(limit = 10) {
    return this.findAll({ orderBy: 'accessedAt DESC', limit });
  }

  async logAccess(documentId, pageNumber) {
    // If it already exists, update it to bubble it up
    const existing = await this.findOne({ documentId, pageNumber });
    const accessedAt = new Date().toISOString();
    if (existing) {
      return this.update(existing.id, { accessedAt });
    }
    return this.create({
      id: this.generateUUID(),
      documentId,
      pageNumber,
      accessedAt,
      duration: 0
    });
  }
}
