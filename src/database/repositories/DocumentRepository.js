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

  async countDocuments() {
    const res = await this.db.getFirstAsync(`SELECT COUNT(*) as c FROM ${this.tableName}`);
    return res?.c || 0;
  }

  async sumStorageUsage() {
    const res = await this.db.getFirstAsync(`SELECT SUM(fileSize) as s FROM ${this.tableName}`);
    return res?.s || 0;
  }
}
