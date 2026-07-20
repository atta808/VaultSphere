import DatabaseService from '../database/services/DatabaseService';
import { Logger } from '../utils/logger/Logger';

class SearchService {
  /**
   * Perform a full-text search using the FTS5 virtual table.
   * Ranks by bm25 relevance.
   */
  async search(query, limit = 50) {
    if (!query || query.trim() === '') return [];

    const db = DatabaseService.getDatabase();
    if (!db) return [];

    // Simple wildcard for prefix matching in FTS5
    // Split the query by spaces, append * to each term for prefix matching.
    const ftsQuery = query
      .trim()
      .split(/\s+/)
      .map(term => `"${term}"*`)
      .join(' AND ');

    // FTS5 bm25 weights (filename, ocr, ai_keywords, ai_entities, ai_summary, tags, notes, metadata)
    // 0 is documentId (UNINDEXED)
    // 1: filename (highest priority)
    // 2: ocr
    // 3: ai_keywords
    // 4: ai_entities
    // 5: ai_summary
    // 6: tags
    // 7: notes
    // 8: metadata (lowest)

    const sql = `
      SELECT d.*
      FROM documents d
      JOIN search_index_fts s ON d.id = s.documentId
      WHERE d.deletedAt IS NULL
        AND search_index_fts MATCH ?
      ORDER BY bm25(search_index_fts, 0, 10.0, 7.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.5)
      LIMIT ?
    `;

    try {
      const results = await db.getAllAsync(sql, [ftsQuery, limit]);
      return results;
    } catch (e) {
      Logger.error('SearchService: Search query failed:', e);
      return [];
    }
  }
}

export default new SearchService();
