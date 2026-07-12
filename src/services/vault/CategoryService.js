import CategoryRepository from '../../database/repositories/CategoryRepository';
import { VaultError } from '../../utils/errors/customErrors';

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async createCategory(name, icon = 'folder', color = '#000000') {
    if (!name) throw new VaultError('Category name is required.');

    const id = await this.repository.create({
      name,
      icon,
      color,
    });

    return await this.repository.findById(id);
  }

  async getAllCategories() {
    return this.repository.findAll();
  }

  async renameCategory(id, newName) {
    if (!newName) throw new VaultError('New category name is required.');

    await this.repository.update(id, { name: newName });
    return await this.repository.findById(id);
  }

  async deleteCategory(id) {
    // Schema has ON DELETE SET NULL for documents.categoryId
    await this.repository.delete(id);
  }
}

export default new CategoryService();
