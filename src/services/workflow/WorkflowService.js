import WorkflowRepository from '../../database/repositories/workflow/WorkflowRepository';
import WorkflowInstanceRepository from '../../database/repositories/workflow/WorkflowInstanceRepository';
import PermissionService from '../collaboration/PermissionService';
import AuditTrailService from '../collaboration/AuditTrailService';

class WorkflowService {
  async startWorkflow(workflowData, user) {
    await PermissionService.validatePermission(user.id, 'workflow', 'create');

    const workflow = await WorkflowRepository.create(workflowData);

    const instance = await WorkflowInstanceRepository.create({
      workflowId: workflow.id,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      uuid: WorkflowInstanceRepository.generateUUID()
    });

    await AuditTrailService.logAction(user.id, 'START_WORKFLOW', 'workflow', workflow.id);
    return instance;
  }
}

export default new WorkflowService();
