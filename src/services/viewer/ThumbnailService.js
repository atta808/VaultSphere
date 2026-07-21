import * as FileSystem from 'expo-file-system';
import { Logger } from '../../utils/logger/Logger';

/**
 * ThumbnailService generates and caches thumbnails for documents.
 * This should execute without blocking the UI thread.
 */
export class ThumbnailService {
  constructor() {
    this.thumbnailCacheDir = FileSystem.cacheDirectory + 'document_thumbnails/';
    this.initCacheDir();
  }

  async initCacheDir() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.thumbnailCacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.thumbnailCacheDir, { intermediates: true });
      }
    } catch (error) {
      Logger.error('Failed to initialize thumbnail cache directory', error);
    }
  }

  async getThumbnailPath(documentId, pageNumber = 1) {
    return `${this.thumbnailCacheDir}${documentId}_page_${pageNumber}.jpg`;
  }

  async hasCachedThumbnail(documentId, pageNumber = 1) {
    const path = await this.getThumbnailPath(documentId, pageNumber);
    const info = await FileSystem.getInfoAsync(path);
    return info.exists;
  }

  /**
   * Generates a thumbnail for the document asynchronously.
   * If a thumbnail already exists, returns the cached path unless force is true.
   */
  async generateThumbnail(document, pageNumber = 1, force = false) {
    try {
      const cachePath = await this.getThumbnailPath(document.id, pageNumber);

      if (!force) {
        const exists = await this.hasCachedThumbnail(document.id, pageNumber);
        if (exists) {
          return cachePath;
        }
      }

      // Logic to generate thumbnail depends on the document type.
      // For images, we can simply copy or resize.
      // For PDFs, we might need a native module or hidden webview to generate it.
      // As a fallback/placeholder, we might just use the original image file for images.

      if (document.mimeType && document.mimeType.startsWith('image/')) {
        // Simple copy for images for now, can be optimized later
        await FileSystem.copyAsync({ from: document.uri, to: cachePath });
        return cachePath;
      }

      // For PDFs and Text, returning null or a generic placeholder for now
      // This allows UI to fallback to an icon.
      return null;
    } catch (error) {
      Logger.error(`Failed to generate thumbnail for doc ${document.id}`, error);
      return null;
    }
  }

  async clearCache(documentId) {
    try {
      if (documentId) {
        // Delete all pages for this document. Not straightforward with expo-file-system
        // to delete by pattern, so we might just read dir and delete matching ones.
        const files = await FileSystem.readDirectoryAsync(this.thumbnailCacheDir);
        for (const file of files) {
          if (file.startsWith(documentId)) {
            await FileSystem.deleteAsync(this.thumbnailCacheDir + file, { idempotent: true });
          }
        }
      } else {
        await FileSystem.deleteAsync(this.thumbnailCacheDir, { idempotent: true });
        await this.initCacheDir();
      }
    } catch (error) {
      Logger.error('Failed to clear thumbnail cache', error);
    }
  }
}

export default new ThumbnailService();
