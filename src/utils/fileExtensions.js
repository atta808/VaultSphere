export const SUPPORTED_EXTENSIONS = [
  'pdf',
  'txt',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'webp'
];

export const getExtensionFromFileName = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return '';
  const parts = fileName.split('.');
  if (parts.length <= 1) return '';
  return parts.pop().toLowerCase();
};

export const isExtensionSupported = (extension) => {
  return SUPPORTED_EXTENSIONS.includes(extension.toLowerCase());
};

export const getExtensionWithoutDot = (extension) => {
  if (!extension) return '';
  return extension.startsWith('.') ? extension.substring(1).toLowerCase() : extension.toLowerCase();
}
