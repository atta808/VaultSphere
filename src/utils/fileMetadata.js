import * as crypto from 'expo-crypto';
import { getExtensionFromName } from './fileNaming';
import { MetadataError } from './errors/customErrors';

const MIME_TYPES = {
  'pdf': 'application/pdf',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'txt': 'text/plain',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'ppt': 'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const calculateMimeType = (extension) => {
  if (!extension) return 'application/octet-stream';
  const cleanExt = extension.replace('.', '').toLowerCase();
  return MIME_TYPES[cleanExt] || 'application/octet-stream';
};

export const generateMetadata = (fileParams) => {
  const { name, size, mimeType: providedMimeType } = fileParams;

  if (!name) {
    throw new MetadataError('Cannot generate metadata: file name is missing.');
  }

  const extension = getExtensionFromName(name);
  const mimeType = providedMimeType || calculateMimeType(extension);

  const now = new Date().toISOString();

  return {
    uuid: crypto.randomUUID(),
    name,
    originalName: name,
    extension,
    mimeType,
    size: size || 0,
    path: '', // Will be updated when file is actually moved to the vault
    thumbnail: '', // Placeholder for now
    favorite: 0,
    encrypted: 0,
    createdAt: now,
    updatedAt: now,
  };
};
