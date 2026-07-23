export class VisualizationService {
  static transformForChart(data, chartType) {
    // Transform raw metrics into charting models
    if (chartType === 'line') {
      return data.map(d => ({ x: d.date, y: d.value }));
    }
    return data;
  }
}
