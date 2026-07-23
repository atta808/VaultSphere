import { BaseRepository } from '../BaseRepository';
import { generateUUID } from '../../../utils/uuid';

export class WebhookRepository extends BaseRepository {
  constructor(databaseProvider) {
    super(databaseProvider, 'webhooks');
  }

  async createWebhook(webhookData) {
    return await this.withTransaction(async (db) => {
      const id = generateUUID();
      const now = new Date().toISOString();
      const payload = {
        ...webhookData,
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
}
