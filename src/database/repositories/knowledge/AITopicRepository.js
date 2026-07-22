import BaseRepository from '../BaseRepository';

class AITopicRepository extends BaseRepository {
  constructor() {
    super('ai_topics');
  }
}

export default new AITopicRepository();
