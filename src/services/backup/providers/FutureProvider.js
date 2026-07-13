class FutureProvider {
  constructor(name) {
    this.name = name || 'Future Provider';
  }

  isConfigured() {
    return false; // Stub
  }

  async initialize() {
    throw new Error(`${this.name} is not implemented in this phase.`);
  }

  async saveBackupPackage(backupSourcePath, backupId) {
    throw new Error(`${this.name} is not implemented in this phase.`);
  }
}

export default new FutureProvider();
