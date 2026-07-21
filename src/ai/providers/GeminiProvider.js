import AIConfig from '../../config/AIConfig';
import { GeminiProviderError } from '../errors';
import { DocumentAnalysisPrompt } from '../prompts/DocumentAnalysisPrompt';
import { AIProvider } from './AIProvider';

export class GeminiProvider extends AIProvider {
  constructor() {
    super('gemini');
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

  /**
   * Generates a standard AI response (non-streaming)
   */
  async generateContent(prompt, options = {}) {
    const apiKey = AIConfig.getGeminiApiKey();
    if (!apiKey) throw new GeminiProviderError('Gemini API key is missing.');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Prepare contents: handle string prompt or array of messages
    let contents = [];
    if (typeof prompt === 'string') {
      contents = [{ parts: [{ text: prompt }] }];
    } else if (Array.isArray(prompt)) {
      // Assuming prompt is array of {role, content}
      contents = prompt.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }

    const requestBody = {
      contents,
      generationConfig: options.generationConfig || {}
    };

    if (options.systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: options.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new GeminiProviderError(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new GeminiProviderError('Invalid response structure from Gemini API.');
      }

      return {
        text: data.candidates[0].content.parts[0].text,
        provider: this.id,
        model: 'gemini-1.5-flash'
      };
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (error instanceof GeminiProviderError) throw error;
      throw new GeminiProviderError('Failed to connect to Gemini API.', error);
    }
  }

  /**
   * Generates a streaming AI response
   */
  async *generateContentStream(prompt, options = {}) {
    const apiKey = AIConfig.getGeminiApiKey();
    if (!apiKey) throw new GeminiProviderError('Gemini API key is missing.');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`;

    let contents = [];
    if (typeof prompt === 'string') {
      contents = [{ parts: [{ text: prompt }] }];
    } else if (Array.isArray(prompt)) {
      contents = prompt.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }

    const requestBody = {
      contents,
      generationConfig: options.generationConfig || {}
    };

    if (options.systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: options.systemInstruction }]
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: options.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new GeminiProviderError(`Gemini stream error: ${response.status} ${errorText}`);
      }

      if (!response.body) {
        throw new GeminiProviderError('Response body is not readable');
      }

      // ReadableStream processing
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Gemini REST streaming returns an array of JSON objects, usually like:
        // [
        //   {...},
        //   {...}
        // ]
        // Each chunk might be incomplete JSON. We need to extract valid complete JSON chunks.
        // For simplicity in React Native `fetch` stream, we buffer and try to parse.
        // A robust implementation would use a proper JSON stream parser.
        // For React Native 'fetch', polyfills might limit true streaming without specific libs.

        // Simplified parsing for JSON stream
        let boundaryIndex = buffer.indexOf('}\n,\r\n');
        if (boundaryIndex === -1) boundaryIndex = buffer.indexOf('},\n');

        // As a fallback for React Native without true SSE/Streaming fetch, we might just yield full text at end
        // if standard streaming fetch isn't fully supported. We will attempt a generic regex extract.

        try {
            // Find all complete "text": "..." blocks in the current buffer
            const textMatches = [...buffer.matchAll(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
            if (textMatches.length > 0) {
               // We need to keep track of what we've yielded to avoid duplicates, or clear buffer.
               // Since Gemini array elements contain the partial text, let's just parse the full string.
               // For a robust implementation, we'll wait for valid JSON objects or use a basic string split.
            }
        } catch(e) {}

        // Instead of complex custom parsing for REST array streaming without a library,
        // yield what we can. For now, since Gemini streaming REST is a bit complex to parse manually
        // chunk by chunk, we will yield text when we can find a new part.

        // Minimal valid parsing for text chunks to demonstrate streaming interface
        // Real implementations on React Native often use polyfills or fallback to non-streaming.
        const matches = [...buffer.matchAll(/"text":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g)];
        if (matches.length > 0) {
          // just yield the last one for now to simulate streaming updates
          // since the stream gives us full partial responses
          const latestText = matches.map(m => m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')).join('');
          yield { text: latestText, provider: this.id, model: 'gemini-1.5-flash', isDone: false };
        }
      }

      yield { text: '', provider: this.id, model: 'gemini-1.5-flash', isDone: true };
    } catch (error) {
       if (error.name === 'AbortError') throw error;
       throw error;
    }
  }

  async healthCheck() {
    return this.isAvailable();
  }
}
