import BaseRepository from '../BaseRepository';

class PermissionRepository extends BaseRepository {
  constructor() {
    super('permissions');
    this.hasSoftDeletes = true;
  }
}

export default new PermissionRepository();
