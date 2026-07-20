import BaseRepository from './BaseRepository';

class SearchHistoryRepository extends BaseRepository {
  constructor() {
    super('search_history');
  }

  async findRecent(limit = 10) {
    if (!this.db) return [];
    return this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} ORDER BY isPinned DESC, updatedAt DESC LIMIT ?`,
      [limit]
    );
  }

  async upsertQuery(query) {
    if (!this.db) return null;
    if (!query || query.trim() === '') return null;

    const normalizedQuery = query.trim().toLowerCase();
    const now = new Date().toISOString();

    const existing = await this.db.getFirstAsync(
      `SELECT * FROM ${this.tableName} WHERE LOWER(query) = ?`,
      [normalizedQuery]
    );

    if (existing) {
      return this.update(existing.id, { updatedAt: now });
    } else {
      return this.create({
        query: query.trim(),
        isPinned: 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  async togglePin(id, isPinned) {
    return this.update(id, {
      isPinned: isPinned ? 1 : 0,
      updatedAt: new Date().toISOString()
    });
  }

  async clearUnpinned() {
    if (!this.db) return;
    await this.db.runAsync(
      `DELETE FROM ${this.tableName} WHERE isPinned = 0`
    );
  }
}

export default new SearchHistoryRepository();
