import FolderRepository from '../../database/repositories/FolderRepository';
import { VaultError } from '../../utils/errors/customErrors';

class FolderService {
  constructor() {
    this.repository = new FolderRepository();
  }

  async createFolder(name, parentId = null, icon = 'folder', color = '#000000') {
    if (!name) throw new VaultError('Folder name is required.');

    const now = new Date().toISOString();
    const id = await this.repository.create({
      name,
      parentId,
      icon,
      color,
      createdAt: now,
      updatedAt: now,
    });

    return await this.repository.findById(id);
  }

  async getAllFolders() {
    return this.repository.findAll();
  }

  async getFolder(id) {
    return this.repository.findById(id);
  }

  async getSubfolders(parentId) {
    return this.repository.findBy('parentId', parentId);
  }

  async renameFolder(id, newName) {
    if (!newName) throw new VaultError('New folder name is required.');

    const now = new Date().toISOString();
    await this.repository.update(id, { name: newName, updatedAt: now });
    return await this.repository.findById(id);
  }

  async moveFolder(id, newParentId) {
    const now = new Date().toISOString();
    await this.repository.update(id, { parentId: newParentId, updatedAt: now });
    return await this.repository.findById(id);
  }

  async deleteFolder(id) {
    // Note: The schema has ON DELETE CASCADE for nested folders and ON DELETE SET NULL for documents.
    // So deleting a folder will delete subfolders and unset folderId on its documents.
    await this.repository.delete(id);
  }
}

export default new FolderService();
