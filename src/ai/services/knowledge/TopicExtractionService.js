import AITopicRepository from '../../../database/repositories/knowledge/AITopicRepository';
import AITopicDocumentRepository from '../../../database/repositories/knowledge/AITopicDocumentRepository';
import ProviderRegistry from '../../providers/ProviderRegistry';

class TopicExtractionService {
  /**
   * Request LLM to analyze document and suggest topics, then link them.
   */
  async extractAndAssignTopics(documentId, documentText) {
    // This requires an LLM call. We use the AnalysisProvider.
    const provider = ProviderRegistry.getAnalysisProvider();

    // Simulate LLM prompt & extraction for Phase 18 skeleton
    const prompt = `Extract top 3 key topics from this text as a JSON array of strings: ${documentText.substring(0, 500)}`;

    // In actual implementation, we await provider.chat(prompt) and parse JSON.
    const mockTopics = ['Finance', 'Legal', 'Q3 Report'];

    for (const topicName of mockTopics) {
        // Find or create topic
        let topics = await AITopicRepository.find('name = ?', [topicName]);
        let topic;
        if (topics.length === 0) {
            topic = await AITopicRepository.create({ name: topicName, description: `AI generated topic: ${topicName}` });
        } else {
            topic = topics[0];
        }

        // Link to doc
        const existingLinks = await AITopicDocumentRepository.find('topicId = ? AND documentId = ?', [topic.id, documentId]);
        if (existingLinks.length === 0) {
            await AITopicDocumentRepository.create({
                topicId: topic.id,
                documentId,
                confidenceScore: 0.9
            });
        }
    }
  }
}

export default new TopicExtractionService();
