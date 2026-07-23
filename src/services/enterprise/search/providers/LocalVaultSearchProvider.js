import { BaseSearchProvider } from './BaseSearchProvider';
import { Logger } from '../../../../utils/logger/Logger';

export class LocalVaultSearchProvider extends BaseSearchProvider {
  getMetadata() {
    return {
      id: 'local-vault-search',
      name: 'Local Vault Keyword Search',
      version: '1.0.0',
      type: 'internal'
    };
  }

  async executeSearch(query, options) {
    Logger.info(`LocalVaultSearchProvider executing: ${query}`);
    // Mocked response representing a SQLite FTS query
    return [
      {
        providerId: this.getMetadata().id,
        externalId: 'doc-123',
        title: `Local Match for ${query}`,
        snippet: 'This is a local document matching the keyword...',
        documentType: 'pdf'
      }
    ];
  }
}
