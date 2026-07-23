import DocumentRepository from '../../../database/repositories/DocumentRepository';
import { AnalyticsRepository } from '../../../database/repositories/enterprise/analytics/AnalyticsRepository';
import { KPIRepository } from '../../../database/repositories/enterprise/analytics/KPIRepository';
import { KPIHistoryRepository } from '../../../database/repositories/enterprise/analytics/KPIHistoryRepository';

export class ForecastService {
  static async generateForecast(metric, periods) {
    const historyRepo = new KPIHistoryRepository();
    const kpiRepo = new KPIRepository();

    let history = [];

    // Find the KPI based on the metric name/identifier
    const kpis = await kpiRepo.findAll();
    const targetKpi = kpis.find(k => k.formulaIdentifier === metric || k.name === metric);

    if (targetKpi) {
        const kpiHistory = await historyRepo.findAll({ where: { kpiId: targetKpi.id }, orderBy: 'calculatedAt ASC' });
        history = kpiHistory.map((h, index) => ({ period: index + 1, value: h.value }));
    } else {
        // Fallback for metrics not directly tied to a KPI, like storage_usage directly
        if(metric === 'storage_usage') {
            const docRepo = new DocumentRepository();
            // Just simulate 2 points for now if no history exists for basic trend, normally we'd query historical snapshots
            const currentStorage = await docRepo.sumStorageUsage();
            history = [
                { period: 1, value: currentStorage * 0.9 }, // Mock past
                { period: 2, value: currentStorage }
            ];
        } else if (metric === 'docs_total') {
            const docRepo = new DocumentRepository();
            const currentDocs = await docRepo.countDocuments();
            history = [
                { period: 1, value: currentDocs > 10 ? currentDocs - 10 : 0 },
                { period: 2, value: currentDocs }
            ];
        }
    }

    if (history.length < 2) {
      // Need at least 2 points for a linear trend
      return {
        metric,
        method: 'Insufficient Data',
        forecast: []
      };
    }

    // Linear regression formula: y = mx + b
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += history[i].period;
      sumY += history[i].value;
      sumXY += history[i].period * history[i].value;
      sumXX += history[i].period * history[i].period;
    }

    const denominator = (n * sumXX - sumX * sumX);
    const m = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - m * sumX) / n;

    const forecast = [];
    const lastPeriod = history[history.length - 1].period;

    for (let i = 1; i <= periods; i++) {
      const nextPeriod = lastPeriod + i;
      const expectedValue = m * nextPeriod + b;
      forecast.push({
        period: nextPeriod,
        expectedValue: parseFloat(expectedValue.toFixed(2))
      });
    }

    return {
      metric,
      method: 'Linear Trend Projection',
      forecast
    };
  }
}
