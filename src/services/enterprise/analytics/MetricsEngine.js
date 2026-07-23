import { KPIService } from './KPIService';
import { KPIRepository } from '../../../database/repositories/enterprise/analytics/KPIRepository';

export class MetricsEngine {
  static async recalculateAll() {
    const repo = new KPIRepository();
    const kpis = await repo.findAll();
    for (const kpi of kpis) {
      await KPIService.calculateKPI(kpi.id, kpi.formulaIdentifier);
    }
  }
}
