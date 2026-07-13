import AIConfig from '../../config/AIConfig';
import { VisionProviderError } from '../errors';

export class GoogleVisionProvider {
  constructor() {
    this.id = 'googleVision';
  }

  initialize() {
    // Initialization handled by AIConfig
  }

  isAvailable() {
    return !!AIConfig.getGoogleVisionApiKey();
  }

  async analyze(base64FileContent, mimeType) {
    const apiKey = AIConfig.getGoogleVisionApiKey();
    if (!apiKey) {
      throw new VisionProviderError('Google Vision API key is missing.');
    }

    const isPDF = mimeType === 'application/pdf';

    // For PDF, Google Vision requires files:annotate and it can handle small PDFs inline
    const url = isPDF
      ? `https://vision.googleapis.com/v1/files:annotate?key=${apiKey}`
      : `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = isPDF ? {
      requests: [
        {
          inputConfig: {
            content: base64FileContent,
            mimeType: 'application/pdf'
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
        }
      ]
    } : {
      requests: [
        {
          image: { content: base64FileContent },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
        }
      ]
    };

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new VisionProviderError(`Google Vision API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      let extractedText = '';
      if (isPDF) {
        if (data.responses && data.responses[0] && data.responses[0].responses) {
          extractedText = data.responses[0].responses.map(r => r.fullTextAnnotation?.text || '').join('\n');
        }
      } else {
        if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
          extractedText = data.responses[0].fullTextAnnotation.text;
        }
      }

      return {
        text: extractedText,
        processingTime,
        provider: this.id
      };
    } catch (error) {
      if (error instanceof VisionProviderError) throw error;
      throw new VisionProviderError('Failed to connect to Google Vision API.', error);
    }
  }

  async healthCheck() {
    return this.isAvailable();
  }
}
