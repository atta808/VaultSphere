import { Logger } from '../../../utils/logger/Logger';

/**
 * Search Suggestion Service
 * Generates type-ahead and related search suggestions.
 */
class Service {
  async getSuggestions(partialQuery) {
    Logger.info(`Fetching suggestions for: ${partialQuery}`);
    return [];
  }
}

export const SearchSuggestionService = new Service();
