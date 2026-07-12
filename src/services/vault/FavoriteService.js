import FavoriteRepository from '../../database/repositories/FavoriteRepository';
import DocumentRepository from '../../database/repositories/DocumentRepository';
import { VaultError } from '../../utils/errors/customErrors';

class FavoriteService {
  constructor() {
    this.favoriteRepository = new FavoriteRepository();
    this.documentRepository = new DocumentRepository();
  }

  async addFavorite(documentId) {
    const doc = await this.documentRepository.findById(documentId);
    if (!doc) throw new VaultError('Document not found.');

    const now = new Date().toISOString();

    // Create favorite record
    await this.favoriteRepository.create({
      documentId,
      createdAt: now,
    });

    // Update document flag
    await this.documentRepository.update(documentId, { favorite: 1, updatedAt: now });
  }

  async removeFavorite(documentId) {
    const doc = await this.documentRepository.findById(documentId);
    if (!doc) throw new VaultError('Document not found.');

    // Remove favorite record
    await this.favoriteRepository.db.runAsync(
      `DELETE FROM ${this.favoriteRepository.tableName} WHERE documentId = ?`,
      [documentId]
    );

    // Update document flag
    const now = new Date().toISOString();
    await this.documentRepository.update(documentId, { favorite: 0, updatedAt: now });
  }

  async isFavorite(documentId) {
    const result = await this.favoriteRepository.findBy('documentId', documentId);
    return result && result.length > 0;
  }

  async getFavorites() {
    // Return actual document records that are favorited
    return this.documentRepository.findBy('favorite', 1);
  }
}

export default new FavoriteService();
