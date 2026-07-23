import { BaseSearchProvider } from './BaseSearchProvider';
import { Logger } from '../../../../utils/logger/Logger';

export class MockExternalSearchProvider extends BaseSearchProvider {
  getMetadata() {
    return {
      id: 'mock-external-search',
      name: 'Mock Enterprise Search (External)',
      version: '1.0.0',
      type: 'external'
    };
  }

  async executeSearch(query, options) {
    Logger.info(`MockExternalSearchProvider executing: ${query}`);
    return [
      {
        providerId: this.getMetadata().id,
        externalId: 'ext-789',
        title: `External Record: ${query}`,
        url: 'https://external-system.mock/doc/789',
        snippet: 'External system snippet. Do not cache full content.',
        documentType: 'web'
      }
    ];
  }
}
