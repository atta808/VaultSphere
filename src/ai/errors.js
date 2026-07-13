export class OCRProcessingError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'OCRProcessingError';
    this.details = details;
  }
}

export class AIAnalysisError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'AIAnalysisError';
    this.details = details;
  }
}

export class VisionProviderError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'VisionProviderError';
    this.details = details;
  }
}

export class GeminiProviderError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'GeminiProviderError';
    this.details = details;
  }
}

export class IndexingError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'IndexingError';
    this.details = details;
  }
}
