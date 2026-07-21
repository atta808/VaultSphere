import BaseRepository from '../BaseRepository';

export class AIMessageRepository extends BaseRepository {
  constructor() {
    super('ai_messages');
    this.hasSoftDeletes = true;
  }

  async createMessage(data) {
    const now = Date.now();
    const id = data.id || this.generateUUID();
    const insertData = {
      id,
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      citations: data.citations ? JSON.stringify(data.citations) : null,
      createdAt: data.createdAt || now,
    };
    await this.create(insertData);

    // Auto-update conversation updatedAt
    await this.db.runAsync(
      `UPDATE ai_conversations SET updatedAt = ? WHERE id = ?`,
      [now, data.conversationId]
    );

    return insertData;
  }

  async getMessagesForConversation(conversationId) {
    const results = await this.findAll({
      where: { conversationId },
      orderBy: 'createdAt ASC'
    });

    return results.map(msg => ({
      ...msg,
      citations: msg.citations ? JSON.parse(msg.citations) : null
    }));
  }

  async clearConversationMessages(conversationId) {
    await this.db.runAsync(`DELETE FROM ai_messages WHERE conversationId = ?`, [conversationId]);
  }
}
