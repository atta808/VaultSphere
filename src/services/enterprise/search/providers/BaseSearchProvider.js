/**
 * Base Search Provider Interface
 */
export class BaseSearchProvider {
  /**
   * Returns provider metadata.
   * @returns {{ id: string, name: string, version: string, type: string }}
   */
  getMetadata() {
    throw new Error('getMetadata() must be implemented');
  }

  /**
   * Indicates if the provider is currently active and available.
   * @returns {boolean}
   */
  isActive() {
    return true;
  }

  /**
   * Executes the search query.
   * @param {string} query
   * @param {Object} options
   * @returns {Promise<Array>} Array of raw result objects
   */
  async executeSearch(query, options) {
    throw new Error('executeSearch() must be implemented');
  }
}
