/**
 * Base Connector Interface
 * All connectors (Storage, Email, CRM, etc.) must implement this interface.
 */
export class BaseConnector {
  /**
   * Returns connector metadata.
   * @returns {{ id: string, name: string, version: string, type: string, capabilities: string[] }}
   */
  getMetadata() {
    throw new Error('getMetadata() must be implemented');
  }

  /**
   * Validates and establishes authentication.
   * @param {Object} credentials
   * @returns {Promise<boolean>}
   */
  async authenticate(credentials) {
    throw new Error('authenticate() must be implemented');
  }

  /**
   * Checks the health of the connection.
   * @returns {Promise<{ status: string, latencyMs: number }>}
   */
  async checkHealth() {
    throw new Error('checkHealth() must be implemented');
  }

  /**
   * Simulates/Performs data import.
   * @param {Object} config
   * @returns {Promise<Object>}
   */
  async importData(config) {
    throw new Error('importData() must be implemented');
  }

  /**
   * Simulates/Performs data export.
   * @param {Object} config
   * @returns {Promise<Object>}
   */
  async exportData(config) {
    throw new Error('exportData() must be implemented');
  }

  /**
   * Performs incremental synchronization.
   * @param {Object} state - previous sync state
   * @returns {Promise<Object>}
   */
  async synchronize(state) {
    throw new Error('synchronize() must be implemented');
  }
}
