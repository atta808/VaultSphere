import * as Crypto from 'expo-crypto';
import { Logger } from '../utils/logger/Logger';
import * as FileSystem from 'expo-file-system';

/**
 * Generates a SHA-256 checksum for a string.
 */
export const generateStringChecksum = async (contentString) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    contentString
  );
};

/**
 * Generates a SHA-256 checksum for a file.
 * Expo Crypto doesn't support streaming large files natively in JS easily yet.
 * We'll use FileSystem.readAsStringAsync in base64 if it's small,
 * but for large database.db or backup packages, this can cause memory issues.
 * A more advanced native approach or reading in chunks would be needed for production.
 * For Phase 9, we will use base64 reading as an MVP for file checksums,
 * or simply hash file metadata (size + lastModified) as a pseudo-checksum to prevent OOM.
 * Actually, we will just hash the manifest and maybe database metadata.
 */
export const generateFileChecksum = async (filePath) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) return null;

    // To prevent out-of-memory errors on large databases or files,
    // we use a pseudo-checksum based on file size and modification time
    // combined with a fast digest. In a real native environment,
    // a true streaming file checksum would be implemented here.
    const fileMetaString = `${fileInfo.size}_${fileInfo.modificationTime || 'none'}`;
    return await generateStringChecksum(fileMetaString);
  } catch (error) {
    Logger.error(`Error generating checksum for ${filePath}:`, error);
    return null;
  }
};
