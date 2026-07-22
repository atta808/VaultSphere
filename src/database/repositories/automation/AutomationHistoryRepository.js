import BaseRepository from '../BaseRepository';

class AutomationHistoryRepository extends BaseRepository {
  constructor() {
    super('automation_history');
    this.hasSoftDeletes = true;
  }
}

export default new AutomationHistoryRepository();
