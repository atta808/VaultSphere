import BaseRepository from '../BaseRepository';

export class WorkflowStepRepository extends BaseRepository {
  constructor() {
    super('workflow_steps');
    this.hasSoftDeletes = true;
  }

  async findByWorkflowId(workflowId) {
    return this.db.getAllAsync('SELECT * FROM workflow_steps WHERE workflowId = ? AND deletedAt IS NULL ORDER BY stepOrder ASC', [workflowId]);
  }

  async findByTemplateId(templateId) {
    return this.db.getAllAsync('SELECT * FROM workflow_steps WHERE templateId = ? AND deletedAt IS NULL ORDER BY stepOrder ASC', [templateId]);
  }
}

export default new WorkflowStepRepository();
