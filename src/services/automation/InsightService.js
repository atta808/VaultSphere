import InsightRepository from '../../database/repositories/automation/InsightRepository';

class InsightService {
  async getActiveInsights() {
    return InsightRepository.getActiveInsights();
  }

  async dismissInsight(id) {
    return InsightRepository.update(id, { isDismissed: 1 });
  }

  async generateInsight(type, title, description, confidenceScore = 1.0, actions = null) {
    return InsightRepository.create({
      uuid: InsightRepository.generateUUID(),
      type,
      title,
      description,
      confidenceScore,
      actions: actions ? JSON.stringify(actions) : null,
      isDismissed: 0
    });
  }

  // Example proactive insight generator that might run as a scheduled job
  async analyzeStorageUsage() {
    // Check storage, if > 90%, generate insight
    await this.generateInsight(
      'STORAGE',
      'High Storage Usage',
      'Your vault is reaching capacity. Consider archiving old documents.'
    );
  }
}

export default new InsightService();
