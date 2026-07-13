import AIConfig from '../../config/AIConfig';
import { GeminiProviderError } from '../errors';
import { DocumentAnalysisPrompt } from '../prompts/DocumentAnalysisPrompt';

export class GeminiProvider {
  constructor() {
    this.id = 'gemini';
  }

  initialize() {}

  isAvailable() {
    return !!AIConfig.getGeminiApiKey();
  }

  async analyze(ocrText) {
    const apiKey = AIConfig.getGeminiApiKey();
    if (!apiKey) {
      throw new GeminiProviderError('Gemini API key is missing.');
    }

    // Using gemini-1.5-flash as the default standard for text processing
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = DocumentAnalysisPrompt.analyzeDocument(ocrText);

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new GeminiProviderError(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new GeminiProviderError('Invalid response structure from Gemini API.');
      }

      const responseText = data.candidates[0].content.parts[0].text;

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new GeminiProviderError('Failed to parse Gemini response as JSON.', parseError);
      }
    } catch (error) {
      if (error instanceof GeminiProviderError) throw error;
      throw new GeminiProviderError('Failed to connect to Gemini API.', error);
    }
  }

  async healthCheck() {
    return this.isAvailable();
  }
}
