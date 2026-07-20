import ImportQueue from './ImportQueue';
import ImportProgress from './ImportProgress';
import { ImportValidator } from './ImportValidator';
import { DuplicateDetector } from '../../utils/duplicateDetector';
import DocumentService from '../vault/DocumentService';
import { generateSafeFileName } from '../../utils/importHelpers';
import { DuplicateFileError } from '../../utils/errors/customErrors';

class ImportJob {
  constructor(file, folderId, resolve, reject) {
    this.id = Date.now().toString() + Math.random().toString(36).substring(7);
    this.file = file;
    this.folderId = folderId;
    this.resolve = resolve;
    this.reject = reject;

    // Default strategy if duplicate is found. Can be 'replace', 'keepBoth', or 'skip'
    this.resolutionStrategy = null;
    this.resolvedName = null;
  }

  async execute(_queueInstance) {
    try {
      const { uri, name, mimeType, size } = this.file;

      // 1. Validation
      await ImportValidator.validateFile(uri, name, mimeType, size);

      // 2. Duplicate Detection
      if (!this.resolutionStrategy) {
        const duplicate = await DuplicateDetector.findDuplicate(name, size, this.folderId);
        if (duplicate) {
          throw new DuplicateFileError(`Duplicate file found: ${name}`, duplicate);
        }
      }

      // 3. Resolve naming
      let finalName = name;
      if (this.resolutionStrategy === 'keepBoth') {
         // Get all docs to find safe name
         const allDocs = await DocumentService.getAllDocuments();
         const existingNames = allDocs
             .filter(d => !d.deletedAt && d.folderId === this.folderId)
             .map(d => d.originalName);
         finalName = generateSafeFileName(name, existingNames);
      }

      // 4. Storage & DB Insertion
      let importedDoc;
      if (this.resolutionStrategy === 'replace' && this.duplicateInfo) {
         // Replace existing file logic handled by DocumentService
         importedDoc = await DocumentService.replaceDocument(this.duplicateInfo.id, uri, finalName, mimeType, size);
      } else {
         // Standard import
         importedDoc = await DocumentService.importDocument(uri, finalName, mimeType, size, this.folderId);
      }

      // 5. Trigger OCR/AI Queue
      // We import it locally first to avoid circular dependencies in this service,
      // but optimally we would import it directly.
      const OCRQueue = require('../../ai/queue/OCRQueue').default;
      if (OCRQueue) {
         OCRQueue.addJob(importedDoc.id);
      }

      this.resolve(importedDoc);
    } catch (error) {
      this.reject(error);
      throw error; // Rethrow for queue to handle
    }
  }

  // Method called after user resolves a duplicate
  resumeWithStrategy(strategy, duplicateInfo) {
    this.resolutionStrategy = strategy;
    this.duplicateInfo = duplicateInfo;
  }
}

class ImportService {
  /**
   * Queues a batch of files for importing.
   * Returns a promise that resolves when ALL files in the batch have been processed.
   * Note: The UI shouldn't wait for this promise for large batches, but rather listen to ImportProgress.
   */
  async queueFiles(files, folderId = null) {
    const promises = [];

    // Create jobs and extract promises.
    const jobObjects = files.map(file => {
       let resolveFunc, rejectFunc;
       const promise = new Promise((res, rej) => {
           resolveFunc = res;
           rejectFunc = rej;
       });
       const job = new ImportJob(file, folderId, resolveFunc, rejectFunc);
       promises.push(promise);
       return job;
    });

    ImportQueue.addJobs(jobObjects);

    // Wait for all to settle (some might fail, some succeed)
    return Promise.allSettled(promises);
  }

  resolveDuplicate(jobId, strategy) {
     const queue = ImportQueue.queue;
     // The paused job is currently at the front of the queue
     if (queue.length > 0 && queue[0].id === jobId) {
         const job = queue[0];
         const duplicateContext = ImportProgress?.instance?.state?.duplicateContext;

         if (strategy === 'skip') {
             ImportQueue.skipCurrentJob();
         } else {
             job.resumeWithStrategy(strategy, duplicateContext?.duplicateInfo);
             ImportQueue.resume();
         }
     }
  }
}

export default new ImportService();
