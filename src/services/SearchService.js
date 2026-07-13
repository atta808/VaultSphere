import DatabaseService from '../database/services/DatabaseService';

class SearchService {
  async search(query) {
    if (!query) return [];

    const db = DatabaseService.getDatabase();
    if (!db) return [];

    // Combine standard document search (by name) with the new search_index.
    // The search_index already stores filename, so we can primarily query it,
    // but joining with documents ensures we only return undeleted files.

    const searchTerm = `%${query}%`;
    const sql = `
      SELECT DISTINCT d.id, d.uuid, d.folderId, d.categoryId, d.name, d.originalName, d.extension, d.mimeType, d.size, d.path, d.thumbnail, d.favorite, d.encrypted, d.createdAt, d.updatedAt
      FROM documents d
      LEFT JOIN search_index si ON d.id = si.documentId
      WHERE d.deletedAt IS NULL
        AND (d.name LIKE ? OR d.originalName LIKE ? OR si.content LIKE ?)
      ORDER BY d.updatedAt DESC
      LIMIT 20
    `;

    try {
      const results = await db.getAllAsync(sql, [searchTerm, searchTerm, searchTerm]);
      return results;
    } catch (e) {
      console.error('Search query failed:', e);
      return [];
    }
  }
}

export default new SearchService();
