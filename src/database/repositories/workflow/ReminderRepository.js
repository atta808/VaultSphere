import BaseRepository from '../BaseRepository';

export class ReminderRepository extends BaseRepository {
  constructor() {
    super('reminders');
    this.hasSoftDeletes = true;
  }

  async findPendingReminders() {
    return this.db.getAllAsync('SELECT * FROM reminders WHERE isSent = 0 AND scheduledFor <= ? AND deletedAt IS NULL', [new Date().toISOString()]);
  }
}

export default new ReminderRepository();
