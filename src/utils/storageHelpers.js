import { documentDirectory, getInfoAsync, makeDirectoryAsync } from 'expo-file-system';
import { normalizePath } from './fileNaming';

export const APP_STORAGE_ROOT = documentDirectory ? normalizePath(`${documentDirectory}VaultSphere`) : normalizePath(`VaultSphere`);

export const STORAGE_PATHS = {
  DOCUMENTS: normalizePath(`${APP_STORAGE_ROOT}/documents`),
  THUMBNAILS: normalizePath(`${APP_STORAGE_ROOT}/thumbnails`),
  TEMP: normalizePath(`${APP_STORAGE_ROOT}/temp`),
  EXPORTS: normalizePath(`${APP_STORAGE_ROOT}/exports`),
  TRASH: normalizePath(`${APP_STORAGE_ROOT}/trash`),
};

export const getDocumentPath = (filename) => normalizePath(`${STORAGE_PATHS.DOCUMENTS}/${filename}`);
export const getThumbnailPath = (filename) => normalizePath(`${STORAGE_PATHS.THUMBNAILS}/${filename}`);
export const getTempPath = (filename) => normalizePath(`${STORAGE_PATHS.TEMP}/${filename}`);
export const getTrashPath = (filename) => normalizePath(`${STORAGE_PATHS.TRASH}/${filename}`);
export const getExportPath = (filename) => normalizePath(`${STORAGE_PATHS.EXPORTS}/${filename}`);

export const ensureDirectoryExists = async (dirPath) => {
  const dirInfo = await getInfoAsync(dirPath);
  if (!dirInfo.exists) {
    await makeDirectoryAsync(dirPath, { intermediates: true });
  }
};
