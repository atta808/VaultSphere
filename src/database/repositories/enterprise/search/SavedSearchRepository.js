import { BaseRepository } from '../../BaseRepository';
import { generateUUID } from '../../../../utils/uuid';

export class SavedSearchRepository extends BaseRepository {
  constructor(databaseProvider) {
    super(databaseProvider, 'saved_searches');
  }

  async saveQuery(name, query, filters = null) {
    return await this.withTransaction(async (db) => {
      const id = generateUUID();
      const now = new Date().toISOString();
      const payload = {
        id,
        name,
        query,
        filters: filters ? JSON.stringify(filters) : null,
        createdAt: now,
        updatedAt: now,
      };

      const columns = Object.keys(payload).join(', ');
      const placeholders = Object.keys(payload).map(() => '?').join(', ');
      const values = Object.values(payload);

      await db.runAsync(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );

      return id;
    });
  }
}
