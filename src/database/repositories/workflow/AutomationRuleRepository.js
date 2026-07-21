import BaseRepository from '../BaseRepository';

export class AutomationRuleRepository extends BaseRepository {
  constructor() {
    super('automation_rules');
    this.hasSoftDeletes = true;
  }

  async findActiveByEventType(eventType) {
    return this.db.getAllAsync('SELECT * FROM automation_rules WHERE eventType = ? AND isEnabled = 1 AND deletedAt IS NULL ORDER BY executionOrder ASC', [eventType]);
  }
}

export default new AutomationRuleRepository();
