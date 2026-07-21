import BaseRepository from '../BaseRepository';

class CollaboratorRepository extends BaseRepository {
  constructor() {
    super('collaborators');
    this.hasSoftDeletes = true;
  }
}

export default new CollaboratorRepository();
