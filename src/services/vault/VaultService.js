import DocumentService from './DocumentService';
import FolderService from './FolderService';
import CategoryService from './CategoryService';
import FavoriteService from './FavoriteService';
import StorageService from './StorageService';
import ImportService from '../import/ImportService';

class VaultService {

  // ==========================================
  // STORAGE & STATS
  // ==========================================

  async getVaultStatistics() {
    return StorageService.getStorageStatistics();
  }

  // ==========================================
  // DOCUMENT ACQUISITION & LIFECYCLE
  // ==========================================

  /**
   * Imports files asynchronously via the ImportQueue.
   * Replaces the old importDocument to use the new Import Engine architecture.
   */
  async importDocuments(files, folderId = null) {
    return ImportService.queueFiles(files, folderId);
  }

  async getAllDocuments() {
    return DocumentService.getAllDocuments();
  }

  async getDocument(id) {
    return DocumentService.getDocument(id);
  }

  async renameDocument(id, newName) {
    return DocumentService.renameDocument(id, newName);
  }

  async moveDocumentToTrash(id) {
    return DocumentService.moveToTrash(id);
  }

  async restoreDocumentFromTrash(id) {
    return DocumentService.restoreFromTrash(id);
  }

  async permanentlyDeleteDocument(id) {
    return DocumentService.permanentlyDelete(id);
  }

  // ==========================================
  // FOLDERS
  // ==========================================

  async createFolder(name, parentId = null) {
    return FolderService.createFolder(name, parentId);
  }

  async getAllFolders() {
    return FolderService.getAllFolders();
  }

  async getFolder(id) {
    return FolderService.getFolder(id);
  }

  async getDocumentsInFolder(folderId) {
    return DocumentService.getDocumentsByFolder(folderId);
  }

  async renameFolder(id, newName) {
    return FolderService.renameFolder(id, newName);
  }

  async moveFolder(id, newParentId) {
    return FolderService.moveFolder(id, newParentId);
  }

  async deleteFolder(id) {
    return FolderService.deleteFolder(id);
  }

  // ==========================================
  // CATEGORIES
  // ==========================================

  async createCategory(name, icon, color) {
    return CategoryService.createCategory(name, icon, color);
  }

  async getAllCategories() {
    return CategoryService.getAllCategories();
  }

  async deleteCategory(id) {
    return CategoryService.deleteCategory(id);
  }

  // ==========================================
  // FAVORITES
  // ==========================================

  async toggleFavorite(documentId) {
    const isFav = await FavoriteService.isFavorite(documentId);
    if (isFav) {
      await FavoriteService.removeFavorite(documentId);
      return false;
    } else {
      await FavoriteService.addFavorite(documentId);
      return true;
    }
  }

  async getFavorites() {
    return FavoriteService.getFavorites();
  }
}

export default new VaultService();
