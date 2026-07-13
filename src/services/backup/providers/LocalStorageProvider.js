import * as FileSystem from 'expo-file-system';
import { BACKUP_ROOT } from '../../../utils/backupHelpers';
import { ensureDirectoryExists } from '../../../utils/storageHelpers';

class LocalStorageProvider {
  constructor() {
    this.name = 'Local Storage';
  }

  isConfigured() {
    return true; // Local storage is always available
  }

  async initialize() {
    await ensureDirectoryExists(BACKUP_ROOT);
  }

  async getStorageStatistics() {
    // In Phase 9, we calculate size of BACKUP_ROOT
    try {
      await ensureDirectoryExists(BACKUP_ROOT);
      const dirs = await FileSystem.readDirectoryAsync(BACKUP_ROOT);
      let totalSize = 0;

      for (const dir of dirs) {
        const dirPath = `${BACKUP_ROOT}/${dir}`;
        const info = await FileSystem.getInfoAsync(dirPath);
        if (info.isDirectory) {
             totalSize += await this._getDirectorySizeRecursive(dirPath);
        }
      }
      return { usedSize: totalSize, backupCount: dirs.length };
    } catch (error) {
      return { usedSize: 0, backupCount: 0 };
    }
  }

  async saveBackupPackage(backupSourcePath, backupId) {
    await this.initialize();

    // In LocalStorageProvider, the backup is already saved by BackupService
    // in the BACKUP_ROOT directory. We might not need to move it again.
    // If BackupService builds it in temp and then passes to Provider,
    // we move it here. For Phase 9, BackupService writes directly to BACKUP_ROOT.
    // Let's assume this is a no-op for LocalStorage if already there,
    // or just a path validation.
    return backupSourcePath;
  }

  async getLatestBackup() {
    await this.initialize();
    const dirs = await FileSystem.readDirectoryAsync(BACKUP_ROOT);
    if (dirs.length === 0) return null;

    // Sort by name (Backup_2026-07-15_10-30-00 will sort naturally)
    dirs.sort((a, b) => b.localeCompare(a));

    const latestDir = dirs[0];
    const path = `${BACKUP_ROOT}/${latestDir}`;

    try {
      const manifestStr = await FileSystem.readAsStringAsync(`${path}/manifest.json`);
      const manifest = JSON.parse(manifestStr);
      return { path, manifest };
    } catch (e) {
      return { path, manifest: null };
    }
  }

  async deleteBackup(backupId) {
     const targetDir = `${BACKUP_ROOT}/Backup_${backupId}`;
     await FileSystem.deleteAsync(targetDir, { idempotent: true });
  }

  async _getDirectorySizeRecursive(dirPath) {
    let totalSize = 0;
    try {
      const info = await FileSystem.getInfoAsync(dirPath);
      if (info.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(dirPath);
        for (const file of files) {
          totalSize += await this._getDirectorySizeRecursive(`${dirPath}/${file}`);
        }
      } else {
        totalSize += info.size || 0;
      }
    } catch (e) {
      // Ignore errors for individual files
    }
    return totalSize;
  }
}

export default new LocalStorageProvider();
