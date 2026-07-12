import { TransactionError } from './errors';
import DatabaseService from '../services/DatabaseService';

/**
 * Runs a block of database operations within a transaction.
 *
 * @param {Function} callback - Async function that executes database queries.
 *                              It is highly recommended for the callback to use the provided `tx` object if needed,
 *                              though mostly repository operations will just run on the main database instance which is wrapped.
 * @returns {Promise<any>} The result of the callback
 */
export async function transaction(callback) {
  const db = DatabaseService.getDatabase();

  if (!db) {
    throw new TransactionError('Database not initialized when starting transaction');
  }

  try {
    return await db.withTransactionAsync(async () => {
      // Execute the provided operations
      return await callback();
    });
  } catch (error) {
    throw new TransactionError('Transaction failed and was rolled back', error);
  }
}
