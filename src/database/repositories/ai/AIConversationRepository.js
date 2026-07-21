import BaseRepository from '../BaseRepository';

export class AIConversationRepository extends BaseRepository {
  constructor() {
    super('ai_conversations');
    this.hasSoftDeletes = true;
  }

  async createConversation(data) {
    const now = Date.now();
    const id = data.id || this.generateUUID();
    const insertData = {
      id,
      title: data.title,
      provider: data.provider,
      model: data.model,
      tokenUsage: data.tokenUsage || 0,
      isPinned: data.isPinned ? 1 : 0,
      isArchived: data.isArchived ? 1 : 0,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };
    await this.create(insertData);
    return insertData;
  }

  async linkDocument(conversationId, documentId) {
    const sql = `
      INSERT OR IGNORE INTO ai_conversation_documents (conversationId, documentId)
      VALUES (?, ?)
    `;
    await this.db.runAsync(sql, [conversationId, documentId]);
  }

  async getDocumentsForConversation(conversationId) {
    const sql = `
      SELECT d.* FROM documents d
      JOIN ai_conversation_documents cd ON d.id = cd.documentId
      WHERE cd.conversationId = ?
    `;
    return await this.db.getAllAsync(sql, [conversationId]);
  }

  async unlinkDocument(conversationId, documentId) {
    const sql = `
      DELETE FROM ai_conversation_documents
      WHERE conversationId = ? AND documentId = ?
    `;
    await this.db.runAsync(sql, [conversationId, documentId]);
  }
}
