import VersionHistoryRepository from '../../database/repositories/collaboration/VersionHistoryRepository';
import * as Crypto from 'expo-crypto';
import AuditTrailService from './AuditTrailService';
import CollaborationSyncService from './CollaborationSyncService';
import DocumentRepository from '../../database/repositories/DocumentRepository';
import * as FileSystem from 'expo-file-system';

class VersionHistoryService {
  async createVersion(documentId, authorUserId, encryptedFilePath, versionNumber, versionNotes = null, metadata = null) {
    const uuid = Crypto.randomUUID();
    const version = await VersionHistoryRepository.create({
      uuid,
      documentId,
      versionNumber,
      authorUserId,
      encryptedFilePath,
      versionNotes,
      metadata: metadata ? JSON.stringify(metadata) : null
    });

    await AuditTrailService.logAction(authorUserId, 'VERSION_CREATED', 'document', documentId, { versionNumber });
    await CollaborationSyncService.queueOperation('CREATE_VERSION', { versionId: version.id });

    return version;
  }

  async getVersions(documentId) {
    return VersionHistoryRepository.findBy({ documentId }, { orderBy: 'versionNumber DESC' });
  }

  async restoreVersion(versionId, userId) {
    const version = await VersionHistoryRepository.findById(versionId);
    if (!version) throw new Error('Version not found');

    const document = await DocumentRepository.findById(version.documentId);
    if (!document) throw new Error('Original document not found');

    // Replace the current encrypted file with the version's encrypted file
    try {
      await FileSystem.copyAsync({
        from: version.encryptedFilePath,
        to: document.path
      });
    } catch (e) {
      throw new Error(`Failed to restore version file: ${e.message}`);
    }

    await AuditTrailService.logAction(userId, 'VERSION_RESTORED', 'document', version.documentId, { versionId });
    await CollaborationSyncService.queueOperation('RESTORE_VERSION', { versionId });

    return version;
  }
}

export default new VersionHistoryService();
