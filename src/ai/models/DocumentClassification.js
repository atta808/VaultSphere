export class DocumentClassification {
  constructor({ classification, confidence = null, provider }) {
    this.classification = classification;
    this.confidence = confidence;
    this.provider = provider;
  }
}
