export const SUPPORTED_MIME_TYPES = {
  // Documents
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',

  // Images
  'image/png': 'png',
  'image/jpeg': 'jpg', // handles both jpg and jpeg
  'image/webp': 'webp'
};

export const getExtensionFromMimeType = (mimeType) => {
  return SUPPORTED_MIME_TYPES[mimeType] || null;
};

export const isMimeTypeSupported = (mimeType) => {
  return !!SUPPORTED_MIME_TYPES[mimeType];
};
