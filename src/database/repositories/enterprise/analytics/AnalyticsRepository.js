import BaseRepository from '../../../BaseRepository';

export class AnalyticsRepository extends BaseRepository {
  constructor() {
    super('analytics_events');
  }
}
