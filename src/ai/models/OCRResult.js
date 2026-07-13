export class OCRResult {
  constructor({ text, language = null, confidence = null, processingTime = 0, provider }) {
    this.text = text;
    this.language = language;
    this.confidence = confidence;
    this.processingTime = processingTime;
    this.provider = provider;
  }
}
