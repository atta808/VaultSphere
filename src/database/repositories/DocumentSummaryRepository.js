import BaseRepository from './BaseRepository';

class DocumentSummaryRepository extends BaseRepository {
  constructor() {
    super('document_summaries');
  }
}

export default new DocumentSummaryRepository();
