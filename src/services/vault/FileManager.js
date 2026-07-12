import * as FileSystem from 'expo-file-system';
import { getDocumentPath, getTrashPath } from '../../utils/storageHelpers';
import { normalizePath, generateUniqueFilename } from '../../utils/fileNaming';
import { FileImportError, FileMoveError, StorageError } from '../../utils/errors/customErrors';

class FileManager {

  async importFile(sourceUri, originalName) {
    try {
      const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
      if (!sourceInfo.exists) {
        throw new FileImportError('Source file does not exist.');
      }

      const uniqueName = generateUniqueFilename(originalName);
      const destPath = getDocumentPath(uniqueName);

      // Copy to vault
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destPath,
      });

      return {
        path: destPath,
        filename: uniqueName,
        size: sourceInfo.size || 0
      };
    } catch (error) {
      if (error instanceof FileImportError) throw error;
      throw new FileImportError(`Failed to import file: ${error.message}`);
    }
  }

  async moveFileToTrash(filename) {
    try {
      const sourcePath = getDocumentPath(filename);
      const trashPath = getTrashPath(filename);

      const exists = await this.fileExists(sourcePath);
      if (!exists) {
        throw new FileMoveError(`File ${filename} does not exist in documents.`);
      }

      await FileSystem.moveAsync({
        from: sourcePath,
        to: trashPath,
      });

      return trashPath;
    } catch (error) {
      if (error instanceof FileMoveError) throw error;
      throw new FileMoveError(`Failed to move file to trash: ${error.message}`);
    }
  }

  async restoreFileFromTrash(filename) {
    try {
      const trashPath = getTrashPath(filename);
      const destPath = getDocumentPath(filename);

      const exists = await this.fileExists(trashPath);
      if (!exists) {
        throw new FileMoveError(`File ${filename} does not exist in trash.`);
      }

      await FileSystem.moveAsync({
        from: trashPath,
        to: destPath,
      });

      return destPath;
    } catch (error) {
      if (error instanceof FileMoveError) throw error;
      throw new FileMoveError(`Failed to restore file: ${error.message}`);
    }
  }

  async deletePermanently(filename, fromTrash = true) {
    try {
      const path = fromTrash ? getTrashPath(filename) : getDocumentPath(filename);
      const exists = await this.fileExists(path);

      if (exists) {
        await FileSystem.deleteAsync(path, { idempotent: true });
      }
    } catch (error) {
      throw new StorageError(`Failed to permanently delete file: ${error.message}`);
    }
  }

  async fileExists(path) {
    try {
      const normalized = normalizePath(path);
      const info = await FileSystem.getInfoAsync(normalized);
      return info.exists;
    } catch (_e) {
      return false;
    }
  }

  async getFileSize(path) {
    try {
      const normalized = normalizePath(path);
      const info = await FileSystem.getInfoAsync(normalized);
      return info.exists ? (info.size || 0) : 0;
    } catch (_e) {
      return 0;
    }
  }
  async replaceFile(sourceUri, filename) {
    try {
      const destPath = getDocumentPath(filename);
      // Ensure target exists before deleting/replacing
      const exists = await this.fileExists(destPath);
      if (exists) {
          await FileSystem.deleteAsync(destPath, { idempotent: true });
      }

      await FileSystem.copyAsync({
        from: sourceUri,
        to: destPath,
      });

      const sourceInfo = await FileSystem.getInfoAsync(destPath);

      return {
        path: destPath,
        filename: filename,
        size: sourceInfo.size || 0
      };
    } catch (error) {
      throw new FileImportError(`Failed to replace file: ${error.message}`);
    }
  }
}
export default new FileManager();
