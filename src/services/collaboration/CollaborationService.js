import CommentRepository from '../../database/repositories/collaboration/CommentRepository';
import CommentReplyRepository from '../../database/repositories/collaboration/CommentReplyRepository';
import * as Crypto from 'expo-crypto';
import AuditTrailService from './AuditTrailService';
import ActivityService from './ActivityService';
import CollaborationSyncService from './CollaborationSyncService';
import PermissionService from './PermissionService';

class CollaborationService {
  async addComment(documentId, workspaceId, authorUserId, content, pageNumber = null, annotationId = null) {
    const hasPermission = await PermissionService.checkPermission(authorUserId, 'document', documentId, 'commenter');
    if (!hasPermission) throw new Error('Unauthorized to add comment');

    const uuid = Crypto.randomUUID();
    const comment = await CommentRepository.create({
      uuid,
      documentId,
      workspaceId,
      authorUserId,
      content,
      pageNumber,
      annotationId,
      status: 'active',
      resolved: 0
    });

    await AuditTrailService.logAction(authorUserId, 'COMMENT_ADDED', 'document', documentId, { commentId: comment.id });
    if (workspaceId) {
      await ActivityService.logActivity(workspaceId, authorUserId, 'COMMENT_ADDED', 'document', documentId, { commentId: comment.id });
    }

    await CollaborationSyncService.queueOperation('ADD_COMMENT', { commentId: comment.id });

    return comment;
  }

  async addReply(commentId, authorUserId, content) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) throw new Error('Comment not found');

    const hasPermission = await PermissionService.checkPermission(authorUserId, 'document', comment.documentId, 'commenter');
    if (!hasPermission) throw new Error('Unauthorized to add reply');

    const uuid = Crypto.randomUUID();
    const reply = await CommentReplyRepository.create({
      uuid,
      commentId,
      authorUserId,
      content
    });

    await AuditTrailService.logAction(authorUserId, 'COMMENT_REPLY_ADDED', 'comment', commentId, { replyId: reply.id });
    await CollaborationSyncService.queueOperation('ADD_COMMENT_REPLY', { replyId: reply.id });

    return reply;
  }

  async getComments(documentId) {
    const comments = await CommentRepository.findBy({ documentId });
    for (const comment of comments) {
      comment.replies = await CommentReplyRepository.findBy({ commentId: comment.id });
    }
    return comments;
  }
}

export default new CollaborationService();
