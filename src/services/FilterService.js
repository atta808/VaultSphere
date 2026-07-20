import DatabaseService from '../database/services/DatabaseService';
import { Logger } from '../utils/logger/Logger';

class FilterService {
  /**
   * Applies filters dynamically.
   * `filters` object may contain: { tags: [], categories: [], folderId: null, isFavorite: null, type: 'images|pdfs' }
   */
  async applyFilters(baseQuery, params = [], filters = {}) {
    const db = DatabaseService.getDatabase();
    if (!db) return { sql: baseQuery, params };

    let sql = baseQuery;
    let queryParams = [...params];

    if (filters.folderId) {
      sql += ` AND d.folderId = ?`;
      queryParams.push(filters.folderId);
    }
    if (filters.isFavorite !== undefined && filters.isFavorite !== null) {
      sql += ` AND d.favorite = ?`;
      queryParams.push(filters.isFavorite ? 1 : 0);
    }
    if (filters.type === 'images') {
      sql += ` AND d.mimeType LIKE 'image/%'`;
    } else if (filters.type === 'pdfs') {
      sql += ` AND d.mimeType = 'application/pdf'`;
    }

    if (filters.tags && filters.tags.length > 0) {
      // Complex: requires documents to have ALL these tags (intersection)
      for (const tagId of filters.tags) {
        sql += ` AND EXISTS (SELECT 1 FROM document_tags dt WHERE dt.documentId = d.id AND dt.tagId = ?)`;
        queryParams.push(tagId);
      }
    }

    return { sql, params: queryParams };
  }
}

export default new FilterService();
