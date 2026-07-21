import { Logger } from '../../utils/logger/Logger';

/**
 * Orchestrates document rendering and coordinates with other viewer services.
 */
export class DocumentViewerService {
  /**
   * Determines the appropriate renderer based on MIME type or file extension.
   */
  getRendererType(mimeType, fileName) {
    if (!mimeType && fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') mimeType = 'application/pdf';
      else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) mimeType = `image/${ext}`;
      else if (['txt', 'md', 'csv', 'json'].includes(ext)) mimeType = 'text/plain';
    }

    if (mimeType === 'application/pdf') {
      return 'pdf';
    }

    if (mimeType && mimeType.startsWith('image/')) {
      return 'image';
    }

    if (mimeType && mimeType.startsWith('text/') || mimeType === 'application/json') {
      return 'text';
    }

    return 'unsupported';
  }

  /**
   * Prepares the document for viewing.
   * Can include decrypting to a temporary secure location if needed.
   */
  async prepareDocument(document) {
    try {
      // In the future, this is where we would decrypt the file to a temp location
      // if it's stored encrypted.
      // For now, return the existing URI.
      return {
        uri: document.uri, // Assuming document has a uri property where the physical file is
        mimeType: document.mimeType,
        fileName: document.fileName
      };
    } catch (error) {
      Logger.error(`Failed to prepare document ${document?.id} for viewing`, error);
      throw error;
    }
  }

  /**
   * Cleans up any temporary resources (like decrypted files) created for viewing.
   */
  async cleanupDocument(preparedUri) {
    // To be implemented when temp files are used for viewing
    try {
      // If preparedUri is a temp file, delete it
    } catch (error) {
      Logger.error('Failed to cleanup document', error);
    }
  }
}

export default new DocumentViewerService();
