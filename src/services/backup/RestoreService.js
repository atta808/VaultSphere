import * as FileSystem from 'expo-file-system';
import DatabaseService from '../../database/services/DatabaseService';
import BackupValidator from './BackupValidator';
import { getBackupDatabasePath, getBackupDocumentsPath, getBackupThumbnailsPath, getBackupManifestPath } from '../../utils/backupHelpers';
import { STORAGE_PATHS } from '../../utils/storageHelpers';
import { RestoreError } from '../../utils/errors/customErrors';
import { DeviceEventEmitter } from 'react-native';

class RestoreService {

  emitProgress(event, payload) {
    DeviceEventEmitter.emit(event, payload);
  }

  async restoreBackup(backupPath) {
    this.emitProgress('RESTORE_STARTED', { progress: 0 });
    let dbClosed = false;

    try {
      // 1. Validate Manifest and Backup Integrity
      this.emitProgress('RESTORE_PROGRESS', { progress: 10, message: 'Validating backup...' });
      const manifestPath = getBackupManifestPath(backupPath);
      const manifest = await BackupValidator.validateManifest(manifestPath);
      await BackupValidator.validateCompatibility(manifest);
      await BackupValidator.validateBackupIntegrity(backupPath);

      this.emitProgress('RESTORE_PROGRESS', { progress: 30, message: 'Validation successful' });

      // 2. Prepare database for restore
      await DatabaseService.close();
      dbClosed = true;

      this.emitProgress('RESTORE_PROGRESS', { progress: 40, message: 'Database closed for restore' });

      // 3. Restore Database
      // The current DB file needs to be replaced.
      const currentDbPath = FileSystem.documentDirectory + 'SQLite/vaultsphere.db';
      const backupDbPath = getBackupDatabasePath(backupPath);

      // Keep a rollback copy of the DB just in case
      const rollbackDbPath = currentDbPath + '.rollback';
      const currentDbInfo = await FileSystem.getInfoAsync(currentDbPath);
      if (currentDbInfo.exists) {
         await FileSystem.copyAsync({ from: currentDbPath, to: rollbackDbPath });
      }

      try {
         // Perform DB replace
         if (currentDbInfo.exists) {
            await FileSystem.deleteAsync(currentDbPath, { idempotent: true });
         }

         // Ensure SQLite directory exists just in case
         await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite', { intermediates: true });

         await FileSystem.copyAsync({ from: backupDbPath, to: currentDbPath });
         this.emitProgress('RESTORE_PROGRESS', { progress: 60, message: 'Database restored' });

      } catch (dbRestoreError) {
         // Rollback DB
         if (await FileSystem.getInfoAsync(rollbackDbPath).then(i => i.exists)) {
             await FileSystem.copyAsync({ from: rollbackDbPath, to: currentDbPath });
         }
         throw dbRestoreError;
      }

      // 4. Restore Documents & Thumbnails
      // To prevent merging old state, we clear current documents/thumbnails
      // Note: A true rollback would back these up too, but for size constraints,
      // we only rollback DB for MVP, or we can just empty and fill.
      await this._clearAndCopyDirectory(getBackupDocumentsPath(backupPath), STORAGE_PATHS.DOCUMENTS);
      this.emitProgress('RESTORE_PROGRESS', { progress: 80, message: 'Documents restored' });

      await this._clearAndCopyDirectory(getBackupThumbnailsPath(backupPath), STORAGE_PATHS.THUMBNAILS);
      this.emitProgress('RESTORE_PROGRESS', { progress: 90, message: 'Thumbnails restored' });

      // Cleanup rollback DB
      if (await FileSystem.getInfoAsync(rollbackDbPath).then(i => i.exists)) {
          await FileSystem.deleteAsync(rollbackDbPath, { idempotent: true });
      }

      // 5. Reinitialize Database and Services
      await DatabaseService.initialize();
      dbClosed = false;

      // Need to reinitialize StorageService to recalculate size/state if needed
      const StorageService = require('../vault/StorageService').default;
      await StorageService.initialize();

      this.emitProgress('RESTORE_COMPLETED', { progress: 100 });
      return true;

    } catch (error) {
      if (dbClosed && !DatabaseService.getDatabase()) {
         try { await DatabaseService.initialize(); } catch(e) { console.error('Failed to reopen DB after restore failure', e); }
      }
      this.emitProgress('RESTORE_FAILED', { error: error.message });
      throw new RestoreError(`Restore failed: ${error.message}`);
    }
  }

  async _clearAndCopyDirectory(sourceDir, targetDir) {
     const targetInfo = await FileSystem.getInfoAsync(targetDir);
     if (targetInfo.exists) {
         // Clear target directory contents
         const existingFiles = await FileSystem.readDirectoryAsync(targetDir);
         for (const file of existingFiles) {
             await FileSystem.deleteAsync(`${targetDir}/${file}`, { idempotent: true });
         }
     } else {
         await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
     }

     const sourceInfo = await FileSystem.getInfoAsync(sourceDir);
     if (sourceInfo.exists) {
         const files = await FileSystem.readDirectoryAsync(sourceDir);
         for (const file of files) {
             await FileSystem.copyAsync({ from: `${sourceDir}/${file}`, to: `${targetDir}/${file}` });
         }
     }
  }
}

export default new RestoreService();
