import { ValidationError } from './errors/customErrors';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const ALLOWED_EXTENSIONS = [
  'pdf', 'jpg', 'jpeg', 'png', 'webp', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
];

// Max file size: 50MB (adjust as needed)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const validateMimeType = (mimeType) => {
  if (!mimeType) {
    throw new ValidationError('MIME type is missing.');
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    throw new ValidationError(`MIME type '${mimeType}' is not supported.`);
  }
  return true;
};

export const validateExtension = (extension) => {
  if (!extension) {
    throw new ValidationError('File extension is missing.');
  }
  const cleanExt = extension.replace('.', '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(cleanExt)) {
    throw new ValidationError(`File extension '${cleanExt}' is not supported.`);
  }
  return true;
};

export const validateFileSize = (size) => {
  if (size === undefined || size === null || isNaN(size)) {
    throw new ValidationError('File size is missing or invalid.');
  }
  if (size > MAX_FILE_SIZE) {
    throw new ValidationError(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
  }
  return true;
};

export const validateFilename = (filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new ValidationError('Filename is missing or invalid.');
  }
  // Prevent path traversal sequences
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new ValidationError('Filename contains invalid characters or path traversal sequences.');
  }
  return true;
};

export const validateFile = ({ mimeType, extension, size, name }) => {
  if (name) validateFilename(name);
  if (mimeType) validateMimeType(mimeType);
  if (extension) validateExtension(extension);
  if (size) validateFileSize(size);
  return true;
};
