// A simple local job queue for short-lived tasks
class JobQueueService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(task) {
    this.queue.push(task);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      try {
        await task();
      } catch (e) {
        console.error('Task failed in JobQueueService', e);
      }
    }

    this.isProcessing = false;
  }
}

export default new JobQueueService();
