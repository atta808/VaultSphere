import BaseRepository from '../BaseRepository';

class CommentReplyRepository extends BaseRepository {
  constructor() {
    super('comment_replies');
    this.hasSoftDeletes = true;
  }
}

export default new CommentReplyRepository();
