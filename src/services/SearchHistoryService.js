import SearchHistoryRepository from '../database/repositories/SearchHistoryRepository';
import { Logger } from '../utils/logger/Logger';

class SearchHistoryService {
  /**
   * Retrieves recent search history.
   */
  async getHistory(limit = 10) {
    try {
      return await SearchHistoryRepository.findRecent(limit);
    } catch (error) {
      Logger.error('SearchHistoryService: Failed to fetch history', error);
      return [];
    }
  }

  /**
   * Adds or updates a search query in history.
   */
  async addSearch(query) {
    if (!query || query.trim() === '') return;
    try {
      await SearchHistoryRepository.upsertQuery(query);
    } catch (error) {
      Logger.error('SearchHistoryService: Failed to add search', error);
    }
  }

  /**
   * Pins or unpins a search query.
   */
  async togglePin(id, isPinned) {
    try {
      await SearchHistoryRepository.togglePin(id, isPinned);
    } catch (error) {
      Logger.error('SearchHistoryService: Failed to toggle pin', error);
    }
  }

  /**
   * Clears all unpinned searches from history.
   */
  async clearHistory() {
    try {
      await SearchHistoryRepository.clearUnpinned();
    } catch (error) {
      Logger.error('SearchHistoryService: Failed to clear history', error);
    }
  }
}

export default new SearchHistoryService();
