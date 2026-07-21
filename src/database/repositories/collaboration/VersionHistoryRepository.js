import BaseRepository from '../BaseRepository';

class VersionHistoryRepository extends BaseRepository {
  constructor() {
    super('version_history');
    this.hasSoftDeletes = true;
  }
}

export default new VersionHistoryRepository();
