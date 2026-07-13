import BaseRepository from './BaseRepository';

class DocumentAnalysisRepository extends BaseRepository {
  constructor() {
    super('document_analysis');
  }

  async create(data) {
    const now = new Date().toISOString();
    return super.create({
      ...data,
      analyzedAt: data.analyzedAt || now,
    });
  }
}

export default new DocumentAnalysisRepository();
