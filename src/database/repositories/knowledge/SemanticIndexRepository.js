import BaseRepository from '../BaseRepository';

class SemanticIndexRepository extends BaseRepository {
  constructor() {
    super('semantic_index');
  }

  async findByDocumentId(documentId) {
    return this.find('documentId = ? ORDER BY chunkIndex ASC', [documentId]);
  }

  async getDocumentChunksWithEmbeddings(documentId) {
    const query = `
      SELECT si.*, e.embeddingData
      FROM semantic_index si
      LEFT JOIN embeddings e ON si.embeddingId = e.id
      WHERE si.documentId = ?
      ORDER BY si.chunkIndex ASC
    `;
    return this.db.getAllAsync(query, [documentId]);
  }

  async getAllChunksWithEmbeddings() {
    const query = `
      SELECT si.*, e.embeddingData
      FROM semantic_index si
      JOIN embeddings e ON si.embeddingId = e.id
      WHERE si.deletedAt IS NULL AND e.deletedAt IS NULL
    `;
    return this.db.getAllAsync(query);
  }
}

export default new SemanticIndexRepository();
