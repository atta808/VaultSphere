import BaseRepository from './BaseRepository';

export default class DocumentRepository extends BaseRepository {
  constructor() {
    super('documents');
    this.hasSoftDeletes = true;
  }

  async create(data) {
    const insertData = { ...data };
    if (!insertData.uuid) {
      insertData.uuid = this.generateUUID();
    }
    return super.create(insertData);
  }

  async findDeleted() {
    return this.db.getAllAsync(
      `SELECT * FROM ${this.tableName} WHERE deletedAt IS NOT NULL`
    );
  }

  async purgeDeleted() {
    return this.db.runAsync(
      `DELETE FROM ${this.tableName} WHERE deletedAt IS NOT NULL`
    );
  }
}
