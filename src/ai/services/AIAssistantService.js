import ConversationService from './ConversationService';
import ProviderRegistry from '../providers/ProviderRegistry';
import { PromptBuilderService } from './PromptBuilderService';
import CitationService from './CitationService';

class AIAssistantService {
  /**
   * Generates a streaming response for a conversation.
   * Yields partial text blocks and metadata until complete.
   */
  async *chatStream(conversationId, userMessageText, documentContextText = null, documentPages = []) {
    // 1. Get or create conversation context
    let messages = await ConversationService.getMessages(conversationId);

    // Save user message immediately
    await ConversationService.addMessage(conversationId, 'user', userMessageText);
    messages.push({ role: 'user', content: userMessageText });

    // 2. Build prompt with history
    const promptArray = PromptBuilderService.buildConversationPrompt(messages, documentContextText);

    // 3. Select Provider
    const provider = ProviderRegistry.getAnalysisProvider();

    // 4. Stream response
    let fullAssistantResponse = '';

    try {
      const stream = provider.generateContentStream(promptArray);

      for await (const chunk of stream) {
        if (chunk.text) {
          fullAssistantResponse += chunk.text;
          yield {
            text: fullAssistantResponse,
            isDone: false
          };
        }
      }

      // 5. Post-process (Citations)
      const citations = CitationService.extractCitations(fullAssistantResponse, documentPages);

      // Save final assistant message
      await ConversationService.addMessage(conversationId, 'assistant', fullAssistantResponse, citations);

      yield {
        text: fullAssistantResponse,
        citations: citations,
        isDone: true
      };

    } catch (error) {
      console.error('Chat stream failed:', error);
      throw error;
    }
  }

  /**
   * Simple non-streaming fallback
   */
  async chat(conversationId, userMessageText, documentContextText = null, documentPages = []) {
    let messages = await ConversationService.getMessages(conversationId);
    await ConversationService.addMessage(conversationId, 'user', userMessageText);
    messages.push({ role: 'user', content: userMessageText });

    const promptArray = PromptBuilderService.buildConversationPrompt(messages, documentContextText);
    const provider = ProviderRegistry.getAnalysisProvider();

    try {
      const response = await provider.generateContent(promptArray);
      const fullResponse = response.text;

      const citations = CitationService.extractCitations(fullResponse, documentPages);
      await ConversationService.addMessage(conversationId, 'assistant', fullResponse, citations);

      return {
        text: fullResponse,
        citations
      };
    } catch (error) {
       console.error('Chat failed:', error);
       throw error;
    }
  }
}

export default new AIAssistantService();
