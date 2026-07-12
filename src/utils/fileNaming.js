import * as crypto from 'expo-crypto';

export const normalizePath = (path) => {
  if (!path) return '';
  // Convert backslashes to forward slashes and remove redundant slashes
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
};

export const generateSafeFilename = (originalName) => {
  if (!originalName) return `file_${Date.now()}`;

  // Remove non-alphanumeric characters except dots, dashes, and underscores
  let safeName = originalName.replace(/[^a-zA-Z0-9.-_]/g, '_');

  // Prevent leading dots (hidden files)
  if (safeName.startsWith('.')) {
    safeName = `file_${safeName}`;
  }

  return safeName;
};

export const getExtensionFromName = (filename) => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) return '';
  return filename.substring(lastDotIndex + 1).toLowerCase();
};

export const removeExtensionFromName = (filename) => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) return filename;
  return filename.substring(0, lastDotIndex);
};

export const generateUniqueFilename = (originalName) => {
  const safeName = generateSafeFilename(originalName);
  const ext = getExtensionFromName(safeName);
  const nameWithoutExt = removeExtensionFromName(safeName);

  const uuid = crypto.randomUUID().substring(0, 8);

  if (ext) {
    return `${nameWithoutExt}_${uuid}.${ext}`;
  }
  return `${safeName}_${uuid}`;
};
