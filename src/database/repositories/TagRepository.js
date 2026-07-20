import BaseRepository from './BaseRepository';
import { Logger } from '../../utils/logger/Logger';

class TagRepository extends BaseRepository {
  constructor() {
    super('tags');
  }

  async findByDocumentId(documentId) {
    if (!this.db) return [];
    try {
      return await this.db.getAllAsync(
        `SELECT t.* FROM tags t
         JOIN document_tags dt ON t.id = dt.tagId
         WHERE dt.documentId = ?`,
        [documentId]
      );
    } catch (error) {
      Logger.error(`Failed to find tags for document ${documentId}`, error);
      return [];
    }
  }

  async findByName(name) {
    if (!this.db) return null;
    return this.findOne({ name });
  }

  async assignToDocument(documentId, tagId) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `INSERT OR IGNORE INTO document_tags (documentId, tagId) VALUES (?, ?)`,
        [documentId, tagId]
      );
    } catch (e) {
      Logger.error(`Failed to assign tag ${tagId} to doc ${documentId}`, e);
    }
  }

  async removeFromDocument(documentId, tagId) {
    if (!this.db) return;
    try {
      await this.db.runAsync(
        `DELETE FROM document_tags WHERE documentId = ? AND tagId = ?`,
        [documentId, tagId]
      );
    } catch (e) {
      Logger.error(`Failed to remove tag ${tagId} from doc ${documentId}`, e);
    }
  }
}

export default new TagRepository();
