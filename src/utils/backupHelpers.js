import { documentDirectory } from 'expo-file-system';
import { normalizePath } from './fileNaming';

export const BACKUP_ROOT = documentDirectory ? normalizePath(`${documentDirectory}VaultSphere/backups`) : normalizePath(`VaultSphere/backups`);

export const getBackupPath = (backupId) => normalizePath(`${BACKUP_ROOT}/Backup_${backupId}`);

export const getBackupDatabasePath = (backupPath) => normalizePath(`${backupPath}/database.db`);
export const getBackupDocumentsPath = (backupPath) => normalizePath(`${backupPath}/documents`);
export const getBackupThumbnailsPath = (backupPath) => normalizePath(`${backupPath}/thumbnails`);
export const getBackupMetadataPath = (backupPath) => normalizePath(`${backupPath}/metadata`);
export const getBackupManifestPath = (backupPath) => normalizePath(`${backupPath}/manifest.json`);
