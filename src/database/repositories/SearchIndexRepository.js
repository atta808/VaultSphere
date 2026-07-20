import BaseRepository from './BaseRepository';
import { Logger } from '../../utils/logger/Logger';

class SearchIndexRepository extends BaseRepository {
  constructor() {
    super('search_index_fts');
  }

  /**
   * Upsert the document index in the FTS table.
   * Because FTS5 doesn't support ON CONFLICT REPLACE directly via the same syntax easily,
   * we delete any existing row for the documentId and then insert.
   */
  async upsertIndex(documentId, data) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `DELETE FROM search_index_fts WHERE documentId = ?`,
        [documentId]
      );

      const {
        filename = '',
        ocr = '',
        ai_keywords = '',
        ai_entities = '',
        ai_summary = '',
        tags = '',
        notes = '',
        metadata = ''
      } = data;

      await this.db.runAsync(
        `INSERT INTO search_index_fts (documentId, filename, ocr, ai_keywords, ai_entities, ai_summary, tags, notes, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [documentId, filename, ocr, ai_keywords, ai_entities, ai_summary, tags, notes, metadata]
      );
    } catch (e) {
      Logger.error(`Failed to upsert search index for document ${documentId}`, e);
    }
  }

  async deleteByDocumentId(documentId) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `DELETE FROM search_index_fts WHERE documentId = ?`,
        [documentId]
      );
    } catch (e) {
      Logger.error(`Failed to delete search index for document ${documentId}`, e);
    }
  }
}

export default new SearchIndexRepository();
