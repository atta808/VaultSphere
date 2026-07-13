import BaseRepository from './BaseRepository';

class SearchIndexRepository extends BaseRepository {
  constructor() {
    super('search_index');
  }
}

export default new SearchIndexRepository();
