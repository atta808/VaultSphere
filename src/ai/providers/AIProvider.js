/**
 * Base abstract class for AI Providers to implement.
 */
export class AIProvider {
  constructor(id) {
    this.id = id;
  }

  initialize() {
    throw new Error('Not implemented');
  }

  isAvailable() {
    throw new Error('Not implemented');
  }

  /**
   * Generates a standard AI response.
   */
  async generateContent(prompt, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Generates a streaming AI response via an async generator.
   */
  async *generateContentStream(prompt, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Specific methods like `analyze` might delegate to generateContent.
   */
  async analyze(ocrText) {
    throw new Error('Not implemented');
  }

  async healthCheck() {
    return this.isAvailable();
  }
}
