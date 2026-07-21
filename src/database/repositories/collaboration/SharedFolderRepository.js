import BaseRepository from '../BaseRepository';

class SharedFolderRepository extends BaseRepository {
  constructor() {
    super('shared_folders');
    this.hasSoftDeletes = true;
  }
}

export default new SharedFolderRepository();
