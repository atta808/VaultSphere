import BaseRepository from '../BaseRepository';

class PromptTemplateRepository extends BaseRepository {
  constructor() {
    super('prompt_templates');
    this.hasSoftDeletes = true;
  }

  async getActiveTemplates() {
    return this.findAll();
  }
}

export default new PromptTemplateRepository();
