import BaseRepository from '../BaseRepository';

class CommentRepository extends BaseRepository {
  constructor() {
    super('comments');
    this.hasSoftDeletes = true;
  }
}

export default new CommentRepository();
