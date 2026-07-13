import DocumentSummaryRepository from '../../database/repositories/DocumentSummaryRepository';

class DocumentSummaryService {
  async saveSummary(documentId, summaryData) {
    return DocumentSummaryRepository.create({
      documentId,
      shortSummary: summaryData.short || null,
      mediumSummary: summaryData.medium || null,
      longSummary: summaryData.long || null
    });
  }
}

export default new DocumentSummaryService();
