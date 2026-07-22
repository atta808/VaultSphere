import WorkflowTemplateRepository from '../../database/repositories/workflow/WorkflowTemplateRepository';
import PermissionService from '../collaboration/PermissionService';

class WorkflowTemplateService {
  async createTemplate(templateData, user) {
    await PermissionService.validatePermission(user.id, 'workflow_template', 'create');
    if (!templateData.uuid) templateData.uuid = WorkflowTemplateRepository.generateUUID();
    return WorkflowTemplateRepository.create(templateData);
  }

  async getTemplates() {
    return WorkflowTemplateRepository.findAll({ includeDeleted: false });
  }
}

export default new WorkflowTemplateService();
