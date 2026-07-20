import ImportQueue from './ImportQueue';
import { Logger } from '../../utils/logger/Logger';

class ImportProgress {
  constructor() {
    if (ImportProgress.instance) {
      return ImportProgress.instance;
    }
    ImportProgress.instance = this;

    this.state = {
      visible: false,
      currentJob: null,
      duplicateContext: null,
      stats: {
        total: 0,
        completed: 0,
        failed: 0,
        skipped: 0,
        cancelled: 0
      }
    };

    this.listeners = new Set();

    this._setupQueueListeners();
  }

  _setupQueueListeners() {
    ImportQueue.on('IMPORT_STARTED', ({ job, state }) => {
      this._updateState({
        visible: true,
        currentJob: job,
        duplicateContext: null,
        stats: state.batch
      });
    });

    ImportQueue.on('IMPORT_PROGRESS', ({ job, progress, _state }) => {
      // Future-proof for chunked uploads
      if (this.state.currentJob?.id === job.id) {
         this.state.currentJob.progress = progress;
         this._notifyListeners();
      }
    });

    ImportQueue.on('IMPORT_DUPLICATE', ({ job, duplicateInfo, state }) => {
      this._updateState({
        currentJob: job,
        duplicateContext: { job, duplicateInfo },
        stats: state.batch
      });
    });

    ImportQueue.on('IMPORT_COMPLETED', ({ _job, state }) => {
      this._updateState({
        currentJob: null,
        duplicateContext: null,
        stats: state.batch
      });
    });

    ImportQueue.on('IMPORT_FAILED', ({ _job, state }) => {
      this._updateState({
        currentJob: null,
        duplicateContext: null,
        stats: state.batch
      });
    });

    ImportQueue.on('QUEUE_EMPTY', ({ state }) => {
      // Keep it visible for a short time to show summary if needed, then hide or let UI hide it
      // Let's just update the stats and keep it visible so user sees the result summary
      this._updateState({
        currentJob: null,
        duplicateContext: null,
        stats: state.batch
      });
    });

    ImportQueue.on('QUEUE_UPDATED', (state) => {
      this._updateState({ stats: state.batch });
    });
  }

  _updateState(newState) {
    this.state = { ...this.state, ...newState };
    this._notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state); // send initial state
    return () => this.listeners.delete(listener);
  }

  _notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
         Logger.error('Error in ImportProgress listener:', e);
      }
    }
  }

  hide() {
    this._updateState({ visible: false });
  }
}

export default new ImportProgress();
