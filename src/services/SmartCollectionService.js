import DatabaseService from '../database/services/DatabaseService';
import { Logger } from '../utils/logger/Logger';

class SmartCollectionService {
  /**
   * General purpose method to execute a smart collection query.
   */
  async _executeQuery(sql, params = []) {
    const db = DatabaseService.getDatabase();
    if (!db) return [];
    try {
      return await db.getAllAsync(sql, params);
    } catch (e) {
      Logger.error('SmartCollectionService: Failed to execute collection query', e);
      return [];
    }
  }

  async getFavorites(limit = 20) {
    const sql = `
      SELECT * FROM documents
      WHERE deletedAt IS NULL AND favorite = 1
      ORDER BY updatedAt DESC
      LIMIT ?
    `;
    return this._executeQuery(sql, [limit]);
  }

  async getOCRCompleted(limit = 20) {
    const sql = `
      SELECT DISTINCT d.* FROM documents d
      JOIN ocr_results o ON d.id = o.documentId
      WHERE d.deletedAt IS NULL
      ORDER BY o.createdAt DESC
      LIMIT ?
    `;
    return this._executeQuery(sql, [limit]);
  }

  async getAIProcessed(limit = 20) {
    const sql = `
      SELECT DISTINCT d.* FROM documents d
      JOIN document_analysis a ON d.id = a.documentId
      WHERE d.deletedAt IS NULL
      ORDER BY a.analyzedAt DESC
      LIMIT ?
    `;
    return this._executeQuery(sql, [limit]);
  }

  async getLargeFiles(limit = 20) {
    const sql = `
      SELECT * FROM documents
      WHERE deletedAt IS NULL AND size > 10485760 -- 10MB
      ORDER BY size DESC
      LIMIT ?
    `;
    return this._executeQuery(sql, [limit]);
  }

  async getByType(mimeTypePrefix, limit = 20) {
    const sql = `
      SELECT * FROM documents
      WHERE deletedAt IS NULL AND mimeType LIKE ?
      ORDER BY createdAt DESC
      LIMIT ?
    `;
    return this._executeQuery(sql, [`${mimeTypePrefix}%`, limit]);
  }
}

export default new SmartCollectionService();
