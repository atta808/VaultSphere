import { BaseRepository } from '../BaseRepository';
import { generateUUID } from '../../../utils/uuid';
import { Logger } from '../../../utils/logger/Logger';

export class ConnectorRepository extends BaseRepository {
  constructor(databaseProvider) {
    super(databaseProvider, 'connectors');
  }

  async createConnector(connectorData) {
    return await this.withTransaction(async (db) => {
      const id = generateUUID();
      const now = new Date().toISOString();
      const payload = {
        ...connectorData,
        id,
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

  async getConnectors() {
    return await this.findMany(`SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL`);
  }
}
