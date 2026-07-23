import * as Crypto from 'expo-crypto';
import { KPIRepository } from '../../../database/repositories/enterprise/analytics/KPIRepository';
import { KPIHistoryRepository } from '../../../database/repositories/enterprise/analytics/KPIHistoryRepository';
import DocumentRepository from '../../../database/repositories/DocumentRepository';

export class KPIService {
  static async getKPIs() {
    const repo = new KPIRepository();
    return await repo.findAll();
  }

  static async calculateKPI(kpiId, formulaIdentifier) {
    const repo = new KPIRepository();
    const historyRepo = new KPIHistoryRepository();
    const docRepo = new DocumentRepository();

    // Stub for actual KPI calculation formulas
    let value = 0;
    if (formulaIdentifier === 'docs_total') {
       value = await docRepo.countDocuments();
    } else if (formulaIdentifier === 'storage_usage') {
       value = await docRepo.sumStorageUsage();
    }

    const now = new Date().toISOString();

    const kpi = await repo.findById(kpiId);
    if(kpi) {
      await repo.update(kpiId, {
        previousValue: kpi.currentValue,
        currentValue: value,
        lastCalculated: now
      });
      await historyRepo.create({
        id: Crypto.randomUUID(),
        kpiId,
        value,
        calculatedAt: now
      });
    }

    return value;
  }
}
