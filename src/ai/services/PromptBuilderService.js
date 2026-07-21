import { AIPrompts } from '../prompts/AIPrompts';

export class PromptBuilderService {
  /**
   * Builds a prompt array of messages for the provider.
   */
  static buildConversationPrompt(messages, documentContext = null) {
    const promptMessages = [];

    if (documentContext) {
      promptMessages.push({
        role: 'system',
        content: AIPrompts.documentContext(documentContext)
      });
    } else {
      promptMessages.push({
        role: 'system',
        content: 'You are an intelligent document assistant.'
      });
    }

    // Append history
    for (const msg of messages) {
      promptMessages.push({
        role: msg.role,
        content: msg.content
      });
    }

    return promptMessages;
  }

  static buildActionPrompt(action, contextText = null) {
    switch (action) {
      case 'summarize':
        return AIPrompts.summarize();
      case 'explain':
        return AIPrompts.explainText(contextText);
      case 'extract':
        return AIPrompts.extractEntities(contextText);
      case 'compare':
        return AIPrompts.compareSummary(contextText);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}
