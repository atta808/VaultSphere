import BaseRepository from '../BaseRepository';

export class WorkflowTemplateRepository extends BaseRepository {
  constructor() {
    super('workflow_templates');
    this.hasSoftDeletes = true;
  }
}

export default new WorkflowTemplateRepository();
