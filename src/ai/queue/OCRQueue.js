import DocumentIntelligenceService from '../services/DocumentIntelligenceService';

class OCRQueue {
  constructor() {
    if (OCRQueue.instance) {
      return OCRQueue.instance;
    }
    OCRQueue.instance = this;

    this.queue = [];
    this.isProcessing = false;
    this.isPaused = false;
    this.listeners = new Map();

    this.currentBatch = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      cancelled: 0
    };
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(payload);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  addJob(documentId) {
    // Avoid duplicates in queue
    if (this.queue.some(job => job.documentId === documentId)) return;

    this.queue.push({ documentId, retries: 0 });
    this.currentBatch.total++;

    if (!this.isProcessing && !this.isPaused) {
      this.processQueue();
    }

    this.emit('QUEUE_UPDATED', this._getQueueState());
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      this.emit('QUEUE_EMPTY', this._getQueueState());
      this._resetBatchContext();
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      if (this.isPaused) {
        break;
      }

      const job = this.queue.shift();
      this.emit('OCR_STARTED', { job, state: this._getQueueState() });

      try {
        const result = await DocumentIntelligenceService.processDocument(job.documentId);

        if (result && result.skipped) {
            this.currentBatch.skipped++;
            this.emit('OCR_SKIPPED', { job, reason: result.reason, state: this._getQueueState() });
        } else {
            this.currentBatch.completed++;
            this.emit('OCR_COMPLETED', { job, state: this._getQueueState() });
        }
      } catch (error) {
        if (job.retries < 3) {
            // Retry
            job.retries++;
            this.queue.unshift(job); // Put back
            this.emit('OCR_RETRY', { job, error, state: this._getQueueState() });
            // Add a small delay
            await new Promise(res => setTimeout(res, 1000));
        } else {
            this.currentBatch.failed++;
            console.error(`OCR Job failed for document ${job.documentId}:`, error);
            this.emit('OCR_FAILED', { job, error, state: this._getQueueState() });
        }
      }
    }

    if (!this.isPaused && this.queue.length === 0) {
      this.isProcessing = false;
      this.emit('QUEUE_EMPTY', this._getQueueState());
      this._resetBatchContext();
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.processQueue();
    }
  }

  cancelJob(documentId) {
     const index = this.queue.findIndex(j => j.documentId === documentId);
     if (index !== -1) {
         this.queue.splice(index, 1);
         this.currentBatch.cancelled++;
         this.currentBatch.total--;
         this.emit('QUEUE_UPDATED', this._getQueueState());
     }
  }

  cancelAll() {
      this.currentBatch.cancelled += this.queue.length;
      this.queue = [];
      this.isPaused = false;
      this.isProcessing = false;
      this.emit('QUEUE_EMPTY', this._getQueueState());
      this._resetBatchContext();
  }

  _getQueueState() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      isPaused: this.isPaused,
      batch: { ...this.currentBatch }
    };
  }

  _resetBatchContext() {
    this.currentBatch = {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      cancelled: 0
    };
  }
}

export default new OCRQueue();
