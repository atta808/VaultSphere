import BaseRepository from './BaseRepository';

class OCRResultRepository extends BaseRepository {
  constructor() {
    super('ocr_results');
  }

  // Override create to auto-set createdAt
  async create(data) {
    const now = new Date().toISOString();
    return super.create({
      ...data,
      createdAt: data.createdAt || now,
    });
  }
}

export default new OCRResultRepository();
