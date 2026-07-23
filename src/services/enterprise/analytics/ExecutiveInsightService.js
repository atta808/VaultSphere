import { ExecutiveInsightRepository } from '../../../database/repositories/enterprise/analytics/ExecutiveInsightRepository';

export class ExecutiveInsightService {
  static async getInsights() {
    const repo = new ExecutiveInsightRepository();
    return await repo.findAll({ orderBy: 'createdAt DESC', limit: 5 });
  }
}
