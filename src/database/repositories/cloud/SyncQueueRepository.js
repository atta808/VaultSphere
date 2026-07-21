import BaseRepository from '../BaseRepository';

class SyncQueueRepository extends BaseRepository {
  constructor() {
    super('sync_queue');
    this.hasSoftDeletes = false;
  }
}

export default new SyncQueueRepository();
