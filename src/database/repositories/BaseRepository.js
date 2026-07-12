import * as Crypto from 'expo-crypto';
import DatabaseService from '../services/DatabaseService';
import { RepositoryError } from '../utils/errors';
import { buildSelect, buildInsert, buildUpdate, buildDelete } from '../utils/queryBuilder';

export default class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.hasSoftDeletes = false; // By default, tables do not have a deletedAt column
  }

  get db() {
    const database = DatabaseService.getDatabase();
    if (!database) {
      throw new RepositoryError('Database is not initialized');
    }
    return database;
  }

  /**
   * Generates a random UUID
   */
  generateUUID() {
    return Crypto.randomUUID();
  }

  /**
   * Find a single record by ID, optionally excluding soft-deleted records.
   */
  async findById(id, includeDeleted = false) {
    try {
      const where = { id };
      if (this.hasSoftDeletes && !includeDeleted) {
        where.deletedAt = null;
      }

      const { sql, args } = buildSelect({ table: this.tableName, where, limit: 1 });
      return await this.db.getFirstAsync(sql, args);
    } catch (error) {
      throw new RepositoryError(`Failed to findById in ${this.tableName}`, error);
    }
  }

  /**
   * Find all records, optionally applying conditions and excluding soft-deleted records.
   */
  async findAll(options = {}) {
    try {
      const { where = {}, includeDeleted = false, orderBy, limit, offset } = options;

      const finalWhere = { ...where };
      if (this.hasSoftDeletes && !includeDeleted) {
        finalWhere.deletedAt = null;
      }

      const { sql, args } = buildSelect({
        table: this.tableName,
        where: finalWhere,
        orderBy,
        limit,
        offset
      });

      return await this.db.getAllAsync(sql, args);
    } catch (error) {
      throw new RepositoryError(`Failed to findAll in ${this.tableName}`, error);
    }
  }

  /**
   * Find records matching specific conditions.
   */
  async findBy(conditions, options = {}) {
    return this.findAll({ where: conditions, ...options });
  }

  /**
   * Find a single record matching specific conditions.
   */
  async findOne(conditions, options = {}) {
    const results = await this.findAll({ where: conditions, limit: 1, ...options });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Insert a new record. Automatically generates UUID if applicable and missing.
   * Also sets createdAt and updatedAt.
   */
  async create(data) {
    try {
      const now = new Date().toISOString();
      const insertData = {
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
      };

      // Auto-generate UUID if not provided but table usually needs it
      // Let's check if the table needs a uuid by checking if data has it,
      // or we can just always inject uuid if it's explicitly supported in table schema.
      // Usually, `documents` table requires it. We will just check if `uuid` key is present
      // or we let child classes handle specific generation. For now, if undefined in data but
      // needed, child repos can pass it, or we can check if it's undefined and not add it,
      // but child repos should generate it.

      const { sql, args } = buildInsert(this.tableName, insertData);
      const result = await this.db.runAsync(sql, args);

      // SQLite returns lastInsertRowId
      return { id: result.lastInsertRowId, ...insertData };
    } catch (error) {
      throw new RepositoryError(`Failed to create in ${this.tableName}`, error);
    }
  }

  /**
   * Insert multiple records.
   */
  async createMany(dataArray) {
    if (!dataArray || dataArray.length === 0) return [];

    // We run in a loop with runAsync since expo-sqlite prepareAsync doesn't support
    // passing array of arrays in a single call easily without loops.
    // In future this can be optimized with batching.
    const results = [];
    for (const data of dataArray) {
      results.push(await this.create(data));
    }
    return results;
  }

  /**
   * Update an existing record by ID. Updates updatedAt.
   */
  async update(id, data) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const { sql, args } = buildUpdate(this.tableName, updateData, { id });
      await this.db.runAsync(sql, args);

      return await this.findById(id, true);
    } catch (error) {
      throw new RepositoryError(`Failed to update in ${this.tableName}`, error);
    }
  }

  /**
   * Update multiple records matching a condition.
   */
  async updateMany(conditions, data) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      const { sql, args } = buildUpdate(this.tableName, updateData, conditions);
      await this.db.runAsync(sql, args);
    } catch (error) {
      throw new RepositoryError(`Failed to updateMany in ${this.tableName}`, error);
    }
  }

  /**
   * Delete a record by ID. Soft delete by default.
   */
  async delete(id, hard = false) {
    try {
      if (this.hasSoftDeletes && !hard) {
        // Soft delete
        const { sql, args } = buildUpdate(
          this.tableName,
          { deletedAt: new Date().toISOString() },
          { id }
        );
        await this.db.runAsync(sql, args);
      } else {
        // Hard delete
        const { sql, args } = buildDelete(this.tableName, { id });
        await this.db.runAsync(sql, args);
      }
    } catch (error) {
      throw new RepositoryError(`Failed to delete in ${this.tableName}`, error);
    }
  }

  /**
   * Restore a soft-deleted record by ID.
   */
  async restore(id) {
    try {
      const { sql, args } = buildUpdate(
        this.tableName,
        { deletedAt: null },
        { id }
      );
      await this.db.runAsync(sql, args);
    } catch (error) {
      throw new RepositoryError(`Failed to restore in ${this.tableName}`, error);
    }
  }

  /**
   * Count records matching conditions.
   */
  async count(conditions = {}, includeDeleted = false) {
    try {
      const finalWhere = { ...conditions };
      if (this.hasSoftDeletes && !includeDeleted) {
        finalWhere.deletedAt = null;
      }

      const whereClause = buildSelect({ table: this.tableName, columns: ['COUNT(*) as count'], where: finalWhere });
      const result = await this.db.getFirstAsync(whereClause.sql, whereClause.args);
      return result ? result.count : 0;
    } catch (error) {
      throw new RepositoryError(`Failed to count in ${this.tableName}`, error);
    }
  }

  /**
   * Check if a record exists matching conditions.
   */
  async exists(conditions = {}, includeDeleted = false) {
    const c = await this.count(conditions, includeDeleted);
    return c > 0;
  }
}
