import { Logger } from '../../utils/logger/Logger';

/**
 * Tracks time spent in a document.
 */
export class DocumentSessionService {
  constructor() {
    this.sessionStart = null;
    this.currentDocumentId = null;
  }

  startSession(documentId) {
    this.currentDocumentId = documentId;
    this.sessionStart = Date.now();
    Logger.info(`Started reading session for ${documentId}`);
  }

  endSession() {
    if (!this.sessionStart) return 0;

    const durationMs = Date.now() - this.sessionStart;
    const durationSec = Math.floor(durationMs / 1000);

    this.sessionStart = null;
    this.currentDocumentId = null;

    return durationSec;
  }
}

export default new DocumentSessionService();
