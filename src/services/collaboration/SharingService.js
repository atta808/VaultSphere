import SharedDocumentRepository from '../../database/repositories/collaboration/SharedDocumentRepository';
import SharedFolderRepository from '../../database/repositories/collaboration/SharedFolderRepository';
import AuditTrailService from './AuditTrailService';
import CollaborationSyncService from './CollaborationSyncService';
import PermissionService from './PermissionService';

class SharingService {
  async shareDocument(documentId, workspaceId, sharedByUserId, expiresAt = null) {
    const hasPermission = await PermissionService.checkPermission(sharedByUserId, 'document', documentId, 'editor');
    if (!hasPermission) throw new Error('Unauthorized to share document');

    const shareLink = `share_doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const sharedDoc = await SharedDocumentRepository.create({
      workspaceId,
      documentId,
      sharedByUserId,
      shareLink,
      expiresAt
    });

    await AuditTrailService.logAction(sharedByUserId, 'DOCUMENT_SHARED', 'document', documentId, { workspaceId, shareLink });

    // Queue sync
    await CollaborationSyncService.queueOperation('SHARE_DOCUMENT', { sharedDocId: sharedDoc.id });

    return sharedDoc;
  }

  async shareFolder(folderId, workspaceId, sharedByUserId, expiresAt = null) {
    const hasPermission = await PermissionService.checkPermission(sharedByUserId, 'folder', folderId, 'editor');
    if (!hasPermission) throw new Error('Unauthorized to share folder');

    const shareLink = `share_fol_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const sharedFolder = await SharedFolderRepository.create({
      workspaceId,
      folderId,
      sharedByUserId,
      shareLink,
      expiresAt
    });

    await AuditTrailService.logAction(sharedByUserId, 'FOLDER_SHARED', 'folder', folderId, { workspaceId, shareLink });

    // Queue sync
    await CollaborationSyncService.queueOperation('SHARE_FOLDER', { sharedFolderId: sharedFolder.id });

    return sharedFolder;
  }

  async getSharedDocuments(workspaceId) {
    return SharedDocumentRepository.findBy({ workspaceId });
  }
}

export default new SharingService();
