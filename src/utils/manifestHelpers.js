import * as FileSystem from 'expo-file-system';
import { generateStringChecksum } from './checksumHelpers';
import { ManifestError } from './errors/customErrors';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export const generateManifest = async (manifestData) => {
  try {
    const timestamp = new Date().toISOString();

    const manifest = {
      backupId: manifestData.backupId,
      backupVersion: "1.0",
      appVersion: Constants.expoConfig?.version || '1.0.0',
      databaseVersion: manifestData.databaseVersion || 1,
      createdDate: timestamp,
      deviceName: Device.deviceName || 'Unknown Device',
      platform: Device.osName || 'Unknown OS',
      vaultVersion: "1.0",
      documentCount: manifestData.documentCount || 0,
      folderCount: manifestData.folderCount || 0,
      categoryCount: manifestData.categoryCount || 0,
      favoriteCount: manifestData.favoriteCount || 0,
      ocrCount: manifestData.ocrCount || 0,
      analysisCount: manifestData.analysisCount || 0,
      searchIndexCount: manifestData.searchIndexCount || 0,
      backupSize: manifestData.backupSize || 0,
    };

    // Calculate a checksum for the manifest itself (excluding the checksum field obviously)
    const manifestString = JSON.stringify(manifest);
    const checksum = await generateStringChecksum(manifestString);

    return {
      ...manifest,
      checksum,
    };
  } catch (error) {
    throw new ManifestError(`Failed to generate manifest: ${error.message}`);
  }
};

export const readManifest = async (manifestPath) => {
  try {
    const content = await FileSystem.readAsStringAsync(manifestPath);
    return JSON.parse(content);
  } catch (error) {
    throw new ManifestError(`Failed to read manifest at ${manifestPath}: ${error.message}`);
  }
};
