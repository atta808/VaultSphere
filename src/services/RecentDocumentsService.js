import DatabaseService from '../database/services/DatabaseService';
import { Logger } from '../utils/logger/Logger';

class RecentDocumentsService {
  /**
   * Fetches the most recently modified or created documents.
   */
  async getRecentlyAdded(limit = 10) {
    return this._fetchOrdered('createdAt DESC', limit);
  }

  async getRecentlyModified(limit = 10) {
    return this._fetchOrdered('updatedAt DESC', limit);
  }

  async _fetchOrdered(orderBy, limit) {
    const db = DatabaseService.getDatabase();
    if (!db) return [];

    try {
      return await db.getAllAsync(
        `SELECT * FROM documents WHERE deletedAt IS NULL ORDER BY ${orderBy} LIMIT ?`,
        [limit]
      );
    } catch (error) {
      Logger.error(`RecentDocumentsService: Failed to fetch documents (${orderBy})`, error);
      return [];
    }
  }
}

export default new RecentDocumentsService();
