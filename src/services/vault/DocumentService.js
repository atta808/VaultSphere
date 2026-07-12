import DocumentRepository from '../../database/repositories/DocumentRepository';
import FileManager from './FileManager';
import { generateMetadata } from '../../utils/fileMetadata';
import { VaultError } from '../../utils/errors/customErrors';

class DocumentService {
  constructor() {
    this.repository = new DocumentRepository();
  }

  async importDocument(sourceUri, originalName, mimeType, size, folderId = null) {
    // 1. Copy to Vault Storage
    const fileResult = await FileManager.importFile(sourceUri, originalName);

    // 2. Generate Metadata
    const metadata = generateMetadata({
      name: originalName,
      size: fileResult.size || size,
      uri: fileResult.path,
      mimeType,
    });

    // 3. Update metadata with actual path and filename from FileManager
    metadata.path = fileResult.path;
    metadata.originalName = originalName;
    metadata.name = fileResult.filename; // Store the safe, unique filename
    metadata.folderId = folderId;

    // 4. Save to Database
    const id = await this.repository.create(metadata);
    return await this.repository.findById(id);
  }

  async getAllDocuments() {
    return this.repository.findAll();
  }

  async getDocumentsByFolder(folderId) {
    return this.repository.findBy('folderId', folderId);
  }

  async getDocument(id) {
    return this.repository.findById(id);
  }

  async moveToTrash(id) {
    const doc = await this.repository.findById(id);
    if (!doc) throw new VaultError('Document not found.');

    // Soft delete in DB
    await this.repository.delete(id);

    // Move file
    if (doc.name) {
      await FileManager.moveFileToTrash(doc.name);
    }
  }

  async restoreFromTrash(id) {
    const doc = await this.repository.findById(id);
    if (!doc) throw new VaultError('Document not found.');

    // Recover file
    if (doc.name) {
      await FileManager.restoreFileFromTrash(doc.name);
    }

    // Recover in DB (assuming soft delete is clearing deletedAt)
    // The BaseRepository typically supports soft deletes via delete() but we may need a raw query to restore.
    await this.repository.db.runAsync(
      `UPDATE ${this.repository.tableName} SET deletedAt = NULL WHERE id = ?`,
      [id]
    );
  }

  async permanentlyDelete(id) {
    const doc = await this.repository.findById(id);
    if (!doc) return;

    // 1. Delete physical file from trash
    if (doc.name) {
      await FileManager.deletePermanently(doc.name, true);
    }

    // 2. Delete from DB
    await this.repository.db.runAsync(
      `DELETE FROM ${this.repository.tableName} WHERE id = ?`,
      [id]
    );
  }

  async renameDocument(id, newName) {
    const doc = await this.repository.findById(id);
    if (!doc) throw new VaultError('Document not found.');

    // We only update originalName for display. The unique filename (name) remains the same.
    const now = new Date().toISOString();
    await this.repository.update(id, { originalName: newName, updatedAt: now });
    return await this.repository.findById(id);
  }

  async replaceDocument(id, sourceUri, newName, mimeType, newSize) {
    const doc = await this.repository.findById(id);
    if (!doc) throw new VaultError('Document not found for replacement.');

    // Replace the physical file. Keep the old underlying filename (doc.name) so links/refs don't break,
    // OR replace it with a new file but update the size and mimeType.
    // Wait, the requirement says "Preserve: UUID, Database ID, Folder...".
    // And "Generate safe filename" implies we might give it a new name. Wait, if it's replace, we just replace the physical file.

    // We will just replace the physical file for doc.name to preserve underlying path.
    // If the originalName changed (e.g., from duplicate dialog), we update originalName.
    const fileResult = await FileManager.replaceFile(sourceUri, doc.name);

    const now = new Date().toISOString();
    await this.repository.update(id, {
       originalName: newName, // Update the display name
       size: fileResult.size || newSize,
       mimeType: mimeType,
       updatedAt: now
    });

    return await this.repository.findById(id);
  }
}

export default new DocumentService();
