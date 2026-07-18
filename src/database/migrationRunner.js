import initialSchema from './migrations/001_initial_schema';
import { Logger } from '../utils/logger/Logger';
import ocrAiSchema from './migrations/002_ocr_ai_schema';
import { MigrationError } from './utils/errors';

// Array of all migrations in order
const migrations = [
  initialSchema,
  ocrAiSchema,
  // Future migrations will be added here
];

export async function runMigrations(db) {
  try {
    // Ensure migrations table exists
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        description TEXT,
        executedAt TEXT NOT NULL
      );
    `);

    // Get current version
    const result = await db.getFirstAsync('SELECT MAX(version) as currentVersion FROM schema_migrations');
    const currentVersion = result?.currentVersion || 0;

    // Run pending migrations
    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        if (__DEV__) {
          Logger.info(`Running migration: v${migration.version} - ${migration.description}`);
        }

        await db.withTransactionAsync(async () => {
          await migration.up(db);

          await db.runAsync(
            'INSERT INTO schema_migrations (version, description, executedAt) VALUES (?, ?, ?)',
            [migration.version, migration.description, new Date().toISOString()]
          );
        });

        if (__DEV__) {
          Logger.info(`Migration v${migration.version} completed.`);
        }
      }
    }
  } catch (error) {
    throw new MigrationError('Failed to execute migrations', error);
  }
}
