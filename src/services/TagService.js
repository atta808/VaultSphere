import TagRepository from '../database/repositories/TagRepository';
import SearchIndexService from './SearchIndexService';
import { Logger } from '../utils/logger/Logger';

class TagService {
  async getAllTags() {
    return await TagRepository.findAll();
  }

  async createTag(name, color = '#6200ee') {
    const existing = await TagRepository.findByName(name);
    if (existing) return existing;
    return await TagRepository.create({ name, color });
  }

  async renameTag(tagId, newName) {
    return await TagRepository.update(tagId, { name: newName });
  }

  async updateColor(tagId, color) {
    return await TagRepository.update(tagId, { color });
  }

  async deleteTag(tagId) {
    // Rely on cascade deletes in SQLite for document_tags
    return await TagRepository.delete(tagId, true);
  }

  async assignTag(documentId, tagId) {
    await TagRepository.assignToDocument(documentId, tagId);
    await SearchIndexService.indexDocument(documentId);
  }

  async removeTag(documentId, tagId) {
    await TagRepository.removeFromDocument(documentId, tagId);
    await SearchIndexService.indexDocument(documentId);
  }

  async bulkAssign(documentIds, tagId) {
    try {
      for (const docId of documentIds) {
        await TagRepository.assignToDocument(docId, tagId);
        await SearchIndexService.indexDocument(docId);
      }
    } catch (e) {
      Logger.error('TagService: Bulk assign failed', e);
    }
  }
}

export default new TagService();
