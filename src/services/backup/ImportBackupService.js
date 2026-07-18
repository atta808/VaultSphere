import * as DocumentPicker from 'expo-document-picker';
import { ImportBackupError, ValidationError } from '../../utils/errors/customErrors';
import { DeviceEventEmitter } from 'react-native';

class ImportBackupService {
  emitProgress(event, payload) {
    DeviceEventEmitter.emit(event, payload);
  }

  async selectAndImportBackup() {
    this.emitProgress('IMPORT_STARTED', { progress: 0 });
    try {
      // Pick the backup. Since Expo Document Picker doesn't easily pick folders,
      // users might need to pick the manifest.json file from their backup folder,
      // and we infer the folder from there.
      // Or they pick a zip if we implemented zip.
      // For this phase, let's ask them to select the `manifest.json` file inside the backup folder.

      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        this.emitProgress('IMPORT_CANCELLED', { progress: 0 });
        return null;
      }

      const asset = result.assets[0];

      if (!asset.name.includes('manifest.json')) {
          throw new ValidationError('Please select the manifest.json file inside your VaultSphere Backup folder.');
      }

      // Since expo-document-picker copies the selected file to a cache dir,
      // it doesn't give us access to the sibling files (the rest of the backup folder) on Android/iOS due to scoped storage.
      // NOTE: This is a known limitation of scoped storage and DocumentPicker.
      // To import a full folder, the backup should ideally be a single ZIP file.
      // But the requirements explicitly asked for a folder structure `VaultSphere_Backup/manifest.json`.
      // If we cannot access the siblings, the restore will fail validation.

      // Let's assume for this mock/foundation that the system provides access,
      // or we are operating in a simulated environment where path manipulation works.
      // (In a real production app without Zip, we'd need Storage Access Framework on Android to pick a tree uri).

      // As a workaround, we return the path so the UI can attempt to validate it.
      // In reality, we might just be importing a ZIP in future.

      // For the sake of Phase 9 architecture, we just pretend the selected asset's
      // original directory is accessible, or we instruct them to copy it to the local app dir.

      // Because we can't reliably read the folder via DocumentPicker manifest,
      // we'll simulate placing it in the backup root for testing.

      // For this phase, if we pick the manifest.json file, we attempt to read the
      // directory it resides in. However, due to scoped storage, we cannot easily copy
      // the sibling files without SAF. For the purpose of meeting Phase 9 requirements,
      // we can't reliably perform a local folder import via DocumentPicker natively in Expo SDK 55.

      // As a workaround that avoids creating an invalid backup folder that crashes validation:
      throw new ImportBackupError('Folder import requires Zip support (Phase 10). Please use Restore Backup for existing local backups.');

    } catch (error) {
      this.emitProgress('IMPORT_FAILED', { error: error.message });
      throw new ImportBackupError(`Import failed: ${error.message}`);
    }
  }
}

export default new ImportBackupService();
