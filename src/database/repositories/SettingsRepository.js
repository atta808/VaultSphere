import DatabaseService from '../services/DatabaseService';
import { RepositoryError } from '../utils/errors';

export default class SettingsRepository {
  constructor() {
    this.tableName = 'settings';
  }

  get db() {
    const database = DatabaseService.getDatabase();
    if (!database) {
      throw new RepositoryError('Database is not initialized');
    }
    return database;
  }

  /**
   * Get a setting by key
   */
  async get(key) {
    try {
      const result = await this.db.getFirstAsync(
        `SELECT value FROM ${this.tableName} WHERE key = ?`,
        [key]
      );
      return result ? result.value : null;
    } catch (error) {
      throw new RepositoryError(`Failed to get setting ${key}`, error);
    }
  }

  /**
   * Set a setting (insert or update)
   */
  async set(key, value) {
    try {
      const updatedAt = new Date().toISOString();
      await this.db.runAsync(
        `INSERT INTO ${this.tableName} (key, value, updatedAt)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = ?, updatedAt = ?`,
        [key, String(value), updatedAt, String(value), updatedAt]
      );
    } catch (error) {
      throw new RepositoryError(`Failed to set setting ${key}`, error);
    }
  }

  /**
   * Remove a setting
   */
  async remove(key) {
    try {
      await this.db.runAsync(`DELETE FROM ${this.tableName} WHERE key = ?`, [key]);
    } catch (error) {
      throw new RepositoryError(`Failed to remove setting ${key}`, error);
    }
  }

  /**
   * Check if a setting exists
   */
  async exists(key) {
    try {
      const result = await this.db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${this.tableName} WHERE key = ?`,
        [key]
      );
      return result ? result.count > 0 : false;
    } catch (error) {
      throw new RepositoryError(`Failed to check existence of setting ${key}`, error);
    }
  }

  /**
   * Get all settings
   */
  async getAll() {
    try {
      return await this.db.getAllAsync(`SELECT * FROM ${this.tableName}`);
    } catch (error) {
      throw new RepositoryError('Failed to get all settings', error);
    }
  }
}
