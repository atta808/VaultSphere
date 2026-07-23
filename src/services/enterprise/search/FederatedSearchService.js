import { Logger } from '../../../utils/logger/Logger';
import { SearchProviderRegistry } from './SearchProviderRegistry';
import { QueryPlannerService } from './QueryPlannerService';
import { SearchAnalyticsService } from './SearchAnalyticsService';

/**
 * Federated Search Service
 * The primary entry point for executing searches across the enterprise architecture.
 */
class Service {
  async initialize() {
    Logger.info('Initializing FederatedSearchService...');
    await SearchProviderRegistry.initialize();
  }

  /**
   * Executes a federated search query.
   * @param {string} query
   * @param {Object} options
   */
  async search(query, options = {}) {
    const startTime = Date.now();
    try {
      Logger.info(`Executing federated search for: ${query}`);

      // Delegate to Query Planner
      const results = await QueryPlannerService.planAndExecute(query, options);

      const executionTime = Date.now() - startTime;

      // Log Analytics
      await SearchAnalyticsService.logSearchEvent({
        query,
        resultCount: results.length,
        executionTimeMs: executionTime,
        searchType: options.searchType || 'federated'
      });

      return results;
    } catch (error) {
      Logger.error(`Search failed for query: ${query}`, error);
      throw error;
    }
  }
}

export const FederatedSearchService = new Service();
