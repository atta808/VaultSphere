import WorkflowInstanceRepository from '../../database/repositories/workflow/WorkflowInstanceRepository';
import WorkflowStepRepository from '../../database/repositories/workflow/WorkflowStepRepository';
import ApprovalRepository from '../../database/repositories/workflow/ApprovalRepository';

class WorkflowEngine {
  async processNextStep(instanceId) {
    const instance = await WorkflowInstanceRepository.findById(instanceId);
    if (!instance) throw new Error('Instance not found');

    const steps = await WorkflowStepRepository.findByWorkflowId(instance.workflowId);
    const pendingSteps = steps.filter(s => s.status === 'pending');

    if (pendingSteps.length === 0) {
      await WorkflowInstanceRepository.update(instanceId, { status: 'completed', completedAt: new Date().toISOString() });
      return;
    }

    const nextStep = pendingSteps[0];

    // If parallel, create approvals for multiple assignees
    // This is simplified logic
    if (nextStep.stepType === 'parallel') {
      const assignees = nextStep.assignedTo ? nextStep.assignedTo.split(',') : [];
      for (const assignee of assignees) {
        await ApprovalRepository.create({
          uuid: ApprovalRepository.generateUUID(),
          workflowInstanceId: instanceId,
          stepId: nextStep.id,
          approverId: assignee.trim(),
          status: 'pending'
        });
      }
    } else {
      // Sequential
      await ApprovalRepository.create({
        uuid: ApprovalRepository.generateUUID(),
        workflowInstanceId: instanceId,
        stepId: nextStep.id,
        approverId: nextStep.assignedTo || 'system',
        status: 'pending'
      });
    }

    await WorkflowStepRepository.update(nextStep.id, { status: 'in_progress' });
  }
}

export default new WorkflowEngine();
