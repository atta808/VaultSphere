import DocumentService from '../services/vault/DocumentService';

export class DuplicateDetector {
  /**
   * Detects if a document is a duplicate by querying the existing documents.
   * Matches by originalName and folderId.
   */
  static async findDuplicate(originalName, size, folderId = null) {
    // In a real optimized system, we might query SQLite directly.
    // For now, we fetch documents (could be filtered by folderId if supported)
    const allDocs = await DocumentService.getAllDocuments();

    return allDocs.find(doc =>
      !doc.deletedAt &&
      doc.originalName === originalName &&
      doc.folderId === folderId &&
      doc.size === size
    );
  }
}
