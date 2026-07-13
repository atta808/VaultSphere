import SearchIndexRepository from '../../database/repositories/SearchIndexRepository';
import { IndexingError } from '../errors';

class SearchIndexService {
  async indexDocument(documentId, { ocrText, summary, keywords, entities, category, filename }) {
    try {
      const records = [];

      if (ocrText) records.push({ documentId, content: ocrText, type: 'ocr', weight: 1 });
      if (summary?.long) records.push({ documentId, content: summary.long, type: 'summary', weight: 2 });

      if (keywords && keywords.length > 0) {
        const keywordString = keywords.map(k => k.keyword).join(' ');
        records.push({ documentId, content: keywordString, type: 'keyword', weight: 3 });
      }

      if (entities && entities.length > 0) {
        const entityString = entities.map(e => e.value).join(' ');
        records.push({ documentId, content: entityString, type: 'entity', weight: 3 });
      }

      if (category) records.push({ documentId, content: category, type: 'category', weight: 4 });
      if (filename) records.push({ documentId, content: filename, type: 'filename', weight: 5 });

      await SearchIndexRepository.createMany(records);
    } catch (error) {
      throw new IndexingError('Failed to index document', error);
    }
  }
}

export default new SearchIndexService();
