import BaseRepository from '../BaseRepository';

export class TaskRepository extends BaseRepository {
  constructor() {
    super('tasks');
    this.hasSoftDeletes = true;
  }

  async findByAssignedUser(userId) {
    return this.db.getAllAsync('SELECT * FROM tasks WHERE assignedUserId = ? AND deletedAt IS NULL', [userId]);
  }

  async findPendingByAssignedUser(userId) {
    return this.db.getAllAsync('SELECT * FROM tasks WHERE assignedUserId = ? AND status IN (?, ?) AND deletedAt IS NULL', [userId, 'pending', 'in_progress']);
  }
}

export default new TaskRepository();
