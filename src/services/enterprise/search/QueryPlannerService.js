import { Logger } from '../../../utils/logger/Logger';
import { SearchProviderRegistry } from './SearchProviderRegistry';
import { ResultNormalizationService } from './ResultNormalizationService';
import { RankingEngine } from './RankingEngine';

/**
 * Query Planner Service
 * Orchestrates parallel provider execution, merging, normalizing, and ranking.
 */
class Service {
  async planAndExecute(query, options) {
    Logger.info(`Planning query execution for: ${query}`);

    // 1. Provider Selection
    const providers = SearchProviderRegistry.getActiveProviders();

    // 2. Parallel Execution
    const searchPromises = providers.map(provider =>
      provider.executeSearch(query, options).catch(err => {
        Logger.error(`Provider ${provider.getMetadata().id} failed:`, err);
        return []; // Return empty array on failure so others succeed
      })
    );

    const resultsArrays = await Promise.all(searchPromises);

    // 3. Merge & Normalize
    let rawResults = [];
    resultsArrays.forEach(arr => { rawResults = rawResults.concat(arr); });

    const normalizedResults = await ResultNormalizationService.normalize(rawResults);

    // 4. Security Filtering (Mocked for now, implies PermissionService validation)
    const securedResults = normalizedResults.filter(res => res._hasPermission !== false);

    // 5. Ranking
    return await RankingEngine.rankResults(securedResults, query);
  }
}

export const QueryPlannerService = new Service();
