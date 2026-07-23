import { Logger } from '../../../utils/logger/Logger';

/**
 * Result Normalization Service
 * Ensures heterogeneous results conform to a standard VaultSphere SearchResult schema.
 */
class Service {
  async normalize(results) {
    Logger.info(`Normalizing ${results.length} search results...`);

    return results.map(res => ({
      id: res.id || res.externalId,
      providerId: res.providerId,
      title: res.title || 'Untitled Document',
      url: res.url || null,
      snippet: res.snippet || null,
      lastModified: res.lastModified || new Date().toISOString(),
      documentType: res.documentType || 'unknown',
      _hasPermission: true // Security validation flag
    }));
  }
}

export const ResultNormalizationService = new Service();
