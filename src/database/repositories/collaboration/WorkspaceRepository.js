import BaseRepository from '../BaseRepository';

class WorkspaceRepository extends BaseRepository {
  constructor() {
    super('workspaces');
    this.hasSoftDeletes = true;
  }
}

export default new WorkspaceRepository();
