import BaseRepository from '../BaseRepository';

class ActivityRepository extends BaseRepository {
  constructor() {
    super('activities');
    this.hasSoftDeletes = false; // Activities are just feeds, typically not soft-deleted unless explicitly requested, but let's keep it simple.
  }
}

export default new ActivityRepository();
