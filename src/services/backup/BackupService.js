import * as FileSystem from 'expo-file-system';
import DatabaseService from '../../database/services/DatabaseService';
import BackupManifest from './BackupManifest';
import BackupValidator from './BackupValidator';
import { BACKUP_ROOT, getBackupPath, getBackupDatabasePath, getBackupDocumentsPath, getBackupThumbnailsPath, getBackupMetadataPath, getBackupManifestPath } from '../../utils/backupHelpers';
import { ensureDirectoryExists, STORAGE_PATHS } from '../../utils/storageHelpers';
import { generateFileChecksum } from '../../utils/checksumHelpers';
import { BackupError } from '../../utils/errors/customErrors';
import DocumentService from '../vault/DocumentService';
import FolderService from '../vault/FolderService';
import CategoryService from '../vault/CategoryService';
import FavoriteService from '../vault/FavoriteService';

// We import the progress queue concept but we don't have a dedicated one yet.
// We'll emit events if possible, or just build the logic.
// The instructions say "Reuse the existing global progress architecture."
// ImportQueue is an example. Let's assume we can just emit events or create a BackupQueue/Event emitter.
// Let's create a simple Event Emitter for backup if not present, but for now we'll just log or return progress.
// Wait, the prompt says "Reuse the global progress architecture" and list events BACKUP_STARTED, BACKUP_PROGRESS, etc.
// Let's create a BackupProgress emitter similar to ImportQueue.

import { DeviceEventEmitter } from 'react-native';

class BackupService {

  emitProgress(event, payload) {
    DeviceEventEmitter.emit(event, payload);
  }

  async createBackup() {
    this.emitProgress('BACKUP_STARTED', { progress: 0 });

    try {
      const backupId = Date.now().toString(); // simple ID based on timestamp
      const backupPath = getBackupPath(backupId);

      // 1. Create backup directory structure
      await ensureDirectoryExists(backupPath);
      await ensureDirectoryExists(getBackupDocumentsPath(backupPath));
      await ensureDirectoryExists(getBackupThumbnailsPath(backupPath));
      await ensureDirectoryExists(getBackupMetadataPath(backupPath));

      this.emitProgress('BACKUP_PROGRESS', { progress: 10, message: 'Directories created' });

      // 2. Prepare database for copy (flush/close/etc.)
      // In expo-sqlite, we might need to close it to copy it safely, or rely on WAL being synced.
      // DatabaseService.close() is available.
      await DatabaseService.close();

      this.emitProgress('BACKUP_PROGRESS', { progress: 20, message: 'Database closed' });

      // 3. Copy database
      const dbInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/vaultsphere.db');
      if (!dbInfo.exists) {
          throw new BackupError('Source database file not found');
      }

      const targetDbPath = getBackupDatabasePath(backupPath);
      await FileSystem.copyAsync({ from: dbInfo.uri, to: targetDbPath });

      this.emitProgress('BACKUP_PROGRESS', { progress: 40, message: 'Database copied' });

      // 4. Copy Documents
      await this._copyDirectoryContents(STORAGE_PATHS.DOCUMENTS, getBackupDocumentsPath(backupPath));
      this.emitProgress('BACKUP_PROGRESS', { progress: 60, message: 'Documents copied' });

      // 5. Copy Thumbnails
      await this._copyDirectoryContents(STORAGE_PATHS.THUMBNAILS, getBackupThumbnailsPath(backupPath));
      this.emitProgress('BACKUP_PROGRESS', { progress: 70, message: 'Thumbnails copied' });

      // Re-initialize database after copy so app continues to work
      await DatabaseService.initialize();

      // 6. Gather counts for Manifest
      // At this point DB is reopened, we can query it.
      const documentCount = (await DocumentService.getAllDocuments()).length;
      const folderCount = (await FolderService.getAllFolders()).length;
      const categoryCount = (await CategoryService.getAllCategories()).length;
      const favoriteCount = (await FavoriteService.getFavorites()).length;

      // Calculate total size of backup
      const backupSize = await this._getDirectorySize(backupPath);

      // 7. Generate Manifest
      const manifestData = {
        backupId,
        databaseVersion: await DatabaseService.getVersion(),
        documentCount,
        folderCount,
        categoryCount,
        favoriteCount,
        ocrCount: 0,
        analysisCount: 0,
        searchIndexCount: 0,
        backupSize
      };

      const manifest = await BackupManifest.create(manifestData);

      // Write manifest
      await FileSystem.writeAsStringAsync(getBackupManifestPath(backupPath), JSON.stringify(manifest, null, 2));

      this.emitProgress('BACKUP_PROGRESS', { progress: 95, message: 'Manifest generated' });

      // Validate the newly created backup
      await BackupValidator.validateBackupIntegrity(backupPath);

      this.emitProgress('BACKUP_COMPLETED', { progress: 100, backupPath, manifest });

      return { backupPath, manifest };
    } catch (error) {
      // Ensure DB is re-opened on error
      if (!DatabaseService.getDatabase()) {
         try { await DatabaseService.initialize(); } catch(e) { console.error('Failed to reopen DB after backup failure', e); }
      }
      this.emitProgress('BACKUP_FAILED', { error: error.message });
      throw new BackupError(`Backup failed: ${error.message}`);
    }
  }

  async _copyDirectoryContents(sourceDir, targetDir) {
    try {
       const info = await FileSystem.getInfoAsync(sourceDir);
       if (!info.exists) return; // Nothing to copy

       const files = await FileSystem.readDirectoryAsync(sourceDir);
       for (const file of files) {
           const sourcePath = `${sourceDir}/${file}`;
           const targetPath = `${targetDir}/${file}`;
           await FileSystem.copyAsync({ from: sourcePath, to: targetPath });
       }
    } catch (e) {
       console.warn(`Failed to copy directory contents from ${sourceDir}:`, e);
    }
  }

  async _getDirectorySize(dirPath) {
    try {
      let totalSize = 0;
      const info = await FileSystem.getInfoAsync(dirPath);
      if (info.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(dirPath);
        for (const file of files) {
           totalSize += await this._getDirectorySize(`${dirPath}/${file}`);
        }
      } else {
        totalSize += info.size || 0;
      }
      return totalSize;
    } catch (e) {
      return 0;
    }
  }
}

export default new BackupService();
