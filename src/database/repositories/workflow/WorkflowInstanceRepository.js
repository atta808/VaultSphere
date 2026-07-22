import BaseRepository from '../BaseRepository';

export class WorkflowInstanceRepository extends BaseRepository {
  constructor() {
    super('workflow_instances');
    this.hasSoftDeletes = true;
  }

  async findByWorkflowId(workflowId) {
    return this.db.getAllAsync('SELECT * FROM workflow_instances WHERE workflowId = ? AND deletedAt IS NULL', [workflowId]);
  }
}

export default new WorkflowInstanceRepository();
