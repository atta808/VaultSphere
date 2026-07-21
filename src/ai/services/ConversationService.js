import { AIConversationRepository } from '../../database/repositories/ai/AIConversationRepository';
import { AIMessageRepository } from '../../database/repositories/ai/AIMessageRepository';

class ConversationService {
  constructor() {
    this.conversationRepo = new AIConversationRepository();
    this.messageRepo = new AIMessageRepository();
  }

  async getConversations() {
    return await this.conversationRepo.findAll({
      orderBy: 'updatedAt DESC'
    });
  }

  async getConversation(id) {
    return await this.conversationRepo.findById(id);
  }

  async createConversation(title, providerId, modelId, documentIds = []) {
    const conversation = await this.conversationRepo.createConversation({
      title,
      provider: providerId,
      model: modelId,
    });

    if (documentIds && documentIds.length > 0) {
      for (const docId of documentIds) {
        await this.conversationRepo.linkDocument(conversation.id, docId);
      }
    }

    return conversation;
  }

  async addMessage(conversationId, role, content, citations = null) {
    return await this.messageRepo.createMessage({
      conversationId,
      role,
      content,
      citations
    });
  }

  async getMessages(conversationId) {
    return await this.messageRepo.getMessagesForConversation(conversationId);
  }

  async clearHistory(conversationId) {
    await this.messageRepo.clearConversationMessages(conversationId);
  }

  async deleteConversation(conversationId) {
    await this.conversationRepo.delete(conversationId);
  }
}

export default new ConversationService();
