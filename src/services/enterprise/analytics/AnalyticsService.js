import * as Crypto from 'expo-crypto';
import { AnalyticsRepository } from '../../../database/repositories/enterprise/analytics/AnalyticsRepository';

export class AnalyticsService {
  static async trackEvent(eventType, metadata = {}, entityId = null, entityType = null, userId = null) {
    const repo = new AnalyticsRepository();
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();

    try {
      await repo.create({
        id, eventType, entityId, entityType, userId, metadata: JSON.stringify(metadata), createdAt
      });
    } catch (e) {
      console.warn('Failed to track analytics event:', e);
    }
  }
}
