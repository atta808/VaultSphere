import * as FileSystem from 'expo-file-system';
import { STORAGE_PATHS, ensureDirectoryExists } from '../../utils/storageHelpers';
import { StorageError } from '../../utils/errors/customErrors';

class StorageService {
  constructor() {
    this.isReady = false;
  }

  async initialize() {
    if (this.isReady) return;

    try {
      // Ensure all base directories exist
      await Promise.all([
        ensureDirectoryExists(STORAGE_PATHS.DOCUMENTS),
        ensureDirectoryExists(STORAGE_PATHS.THUMBNAILS),
        ensureDirectoryExists(STORAGE_PATHS.TEMP),
        ensureDirectoryExists(STORAGE_PATHS.EXPORTS),
        ensureDirectoryExists(STORAGE_PATHS.TRASH),
      ]);

      this.isReady = true;
    } catch (error) {
      throw new StorageError(`Failed to initialize storage: ${error.message}`);
    }
  }

  async getStorageStatistics() {
    if (!this.isReady) throw new StorageError('StorageService is not initialized');

    try {
      const docsSize = await this._getDirectorySize(STORAGE_PATHS.DOCUMENTS);
      const trashSize = await this._getDirectorySize(STORAGE_PATHS.TRASH);
      const tempSize = await this._getDirectorySize(STORAGE_PATHS.TEMP);

      // Using FileSystem.getFreeDiskStorageAsync to get real system limits,
      // fallback to 0 if not available.
      let freeSpace = 0;
      let totalSpace = 0;

      try {
        freeSpace = await FileSystem.getFreeDiskStorageAsync();
        totalSpace = await FileSystem.getTotalDiskCapacityAsync();
      } catch (e) {
        // Fallback for environments that do not support it
      }

      return {
        usedDocs: docsSize,
        usedTrash: trashSize,
        usedTemp: tempSize,
        totalUsed: docsSize + trashSize + tempSize,
        freeSpace,
        totalSpace
      };
    } catch (error) {
      throw new StorageError(`Failed to calculate storage statistics: ${error.message}`);
    }
  }

  async cleanupTemporaryFiles() {
    if (!this.isReady) throw new StorageError('StorageService is not initialized');

    try {
      const tempFiles = await FileSystem.readDirectoryAsync(STORAGE_PATHS.TEMP);
      await Promise.all(
        tempFiles.map((file) =>
          FileSystem.deleteAsync(`${STORAGE_PATHS.TEMP}/${file}`, { idempotent: true })
        )
      );
    } catch (error) {
      throw new StorageError(`Failed to cleanup temp files: ${error.message}`);
    }
  }

  async _getDirectorySize(dirPath) {
    try {
      const files = await FileSystem.readDirectoryAsync(dirPath);
      let totalSize = 0;
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${dirPath}/${file}`);
        if (!fileInfo.isDirectory && fileInfo.exists) {
          totalSize += fileInfo.size || 0;
        }
      }
      return totalSize;
    } catch (error) {
      return 0;
    }
  }
}

export default new StorageService();
