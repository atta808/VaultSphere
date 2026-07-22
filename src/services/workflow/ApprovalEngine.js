import ApprovalRepository from '../../database/repositories/workflow/ApprovalRepository';
import WorkflowEngine from './WorkflowEngine';

class ApprovalEngine {
  async evaluateStep(stepId, instanceId) {
    // Basic multi-level / parallel evaluation
    const approvals = await ApprovalRepository.findByInstanceId(instanceId);
    const stepApprovals = approvals.filter(a => a.stepId === stepId);

    const allApproved = stepApprovals.every(a => a.status === 'approved');
    const anyRejected = stepApprovals.some(a => a.status === 'rejected');

    if (anyRejected) {
      // Handle rejection flow
      // Trigger rejection logic...
    } else if (allApproved) {
      // Process next step in workflow
      await WorkflowEngine.processNextStep(instanceId);
    }
  }
}

export default new ApprovalEngine();
