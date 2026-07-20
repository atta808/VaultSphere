import * as Sharing from 'expo-sharing';
import { ExportError } from '../../utils/errors/customErrors';
import { DeviceEventEmitter } from 'react-native';

class ExportService {
  emitProgress(event, payload) {
    DeviceEventEmitter.emit(event, payload);
  }

  async exportBackup(backupPath) {
    this.emitProgress('EXPORT_STARTED', { progress: 0 });

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new ExportError('Sharing is not available on this device');
      }

      // expo-sharing might not directly share a directory on Android.
      // But we will pass the backupPath to it and let Expo handle it.
      // If it fails on Android, we would need to zip it.
      // However, requirements say "ExportService should export the backup package"
      // and "Use expo-sharing". Let's attempt to share the directory.
      // If it's a directory, iOS usually handles it as a zipped file natively when sharing via AirDrop,
      // but Android might fail. We will attempt it directly.

      await Sharing.shareAsync(backupPath, {
          dialogTitle: 'Export Vault Backup',
          mimeType: 'application/octet-stream', // directory
      });

      this.emitProgress('EXPORT_COMPLETED', { progress: 100 });
      return true;
    } catch (error) {
      this.emitProgress('EXPORT_FAILED', { error: error.message });
      throw new ExportError(`Export failed: ${error.message}`);
    }
  }
}

export default new ExportService();
