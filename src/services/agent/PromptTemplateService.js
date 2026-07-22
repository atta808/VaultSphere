import PromptTemplateRepository from '../../database/repositories/agent/PromptTemplateRepository';

class PromptTemplateService {
  async getTemplates() {
    return PromptTemplateRepository.getActiveTemplates();
  }

  async getTemplateById(id) {
    return PromptTemplateRepository.findById(id);
  }

  async createTemplate(data) {
    return PromptTemplateRepository.create({
      uuid: PromptTemplateRepository.generateUUID(),
      ...data
    });
  }
}

export default new PromptTemplateService();
