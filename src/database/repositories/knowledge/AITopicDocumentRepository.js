import BaseRepository from '../BaseRepository';

class AITopicDocumentRepository extends BaseRepository {
  constructor() {
    super('ai_topic_documents');
  }

  async findByTopicId(topicId) {
    return this.find('topicId = ?', [topicId]);
  }

  async findByDocumentId(documentId) {
    return this.find('documentId = ?', [documentId]);
  }
}

export default new AITopicDocumentRepository();
