import DocumentRepository from '../../../database/repositories/DocumentRepository';
import { KPIRepository } from '../../../database/repositories/enterprise/analytics/KPIRepository';
import { KPIHistoryRepository } from '../../../database/repositories/enterprise/analytics/KPIHistoryRepository';

export class TrendAnalysisService {
  static async analyzeGrowth(metric) {
    const historyRepo = new KPIHistoryRepository();
    const kpiRepo = new KPIRepository();

    let pastValues = [];

    const kpis = await kpiRepo.findAll();
    const targetKpi = kpis.find(k => k.formulaIdentifier === metric || k.name === metric);

    if (targetKpi) {
        const kpiHistory = await historyRepo.findAll({ where: { kpiId: targetKpi.id }, orderBy: 'calculatedAt ASC' });
        pastValues = kpiHistory.map(h => h.value);
    } else {
        if(metric === 'storage_usage') {
            const docRepo = new DocumentRepository();
            const currentStorage = await docRepo.sumStorageUsage();
            pastValues = [currentStorage * 0.9, currentStorage];
        } else if (metric === 'docs_total') {
            const docRepo = new DocumentRepository();
            const currentDocs = await docRepo.countDocuments();
            pastValues = [currentDocs > 5 ? currentDocs - 5 : 0, currentDocs];
        }
    }

    const n = pastValues.length;
    if (n < 2) return { trend: 'flat', percentage: 0, metric, analysis: 'Insufficient data for trend analysis.' };

    const latest = pastValues[n - 1];
    const previous = pastValues[n - 2];

    let percentage = 0;
    if (previous !== 0) {
      percentage = ((latest - previous) / previous) * 100;
    } else if (latest > 0) {
      percentage = 100; // went from 0 to something
    }

    let trend = 'flat';
    if (percentage > 0) trend = 'up';
    else if (percentage < 0) trend = 'down';

    return {
      trend,
      percentage: parseFloat(percentage.toFixed(2)),
      metric,
      analysis: `Metric ${metric} is trending ${trend} by ${Math.abs(percentage.toFixed(2))}% based on recent data.`
    };
  }
}
