import BaseRepository from '../BaseRepository';

class WorkspaceMemberRepository extends BaseRepository {
  constructor() {
    super('workspace_members');
    this.hasSoftDeletes = true;
  }
}

export default new WorkspaceMemberRepository();
