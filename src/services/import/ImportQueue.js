import { Logger } from '../../utils/logger/Logger';
class ImportQueue {
  constructor() {
    if (ImportQueue.instance) {
      return ImportQueue.instance;
    }
    ImportQueue.instance = this;

    this.queue = [];
    this.isProcessing = false;
    this.isPaused = false;
    this.listeners = new Map();

    // Batch context
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
          Logger.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  addJobs(jobs) {
    this.queue.push(...jobs);
    this.currentBatch.total += jobs.length;

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
        break; // Wait to be resumed
      }

      const job = this.queue.shift(); // take first job
      this.emit('IMPORT_STARTED', { job, state: this._getQueueState() });

      try {
        await job.execute(this);
        this.currentBatch.completed++;
        this.emit('IMPORT_COMPLETED', { job, state: this._getQueueState() });
      } catch (error) {
        if (error.name === 'DuplicateFileError') {
          // Put the job back at the front of the queue, pause, and emit duplicate event
          this.queue.unshift(job);
          this.isPaused = true;
          this.emit('IMPORT_DUPLICATE', { job, duplicateInfo: error.duplicateInfo, state: this._getQueueState() });
          break; // Stop processing loop
        } else if (error.name === 'CancelledImportError') {
           this.currentBatch.cancelled++;
           this.emit('IMPORT_CANCELLED', { job, state: this._getQueueState() });
        } else {
          this.currentBatch.failed++;
          Logger.error(`Job failed: ${job.file.name}`, error);
          this.emit('IMPORT_FAILED', { job, error, state: this._getQueueState() });
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

  cancelJob(jobId) {
     const index = this.queue.findIndex(j => j.id === jobId);
     if (index !== -1) {
         this.queue.splice(index, 1);
         this.currentBatch.cancelled++;
         this.currentBatch.total--;
         this.emit('QUEUE_UPDATED', this._getQueueState());
     }
  }

  skipCurrentJob() {
      if (this.queue.length > 0) {
          const skippedJob = this.queue.shift();
          this.currentBatch.skipped++;
          this.emit('IMPORT_COMPLETED', { job: skippedJob, state: this._getQueueState(), skipped: true });
          this.resume();
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

export default new ImportQueue();
