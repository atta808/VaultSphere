import { Logger } from '../../utils/logger/Logger';

export const version = 14;
export const description = 'Phase 23 - Federated Search & Unified Knowledge Discovery';

export async function up(db) {
  try {
    Logger.info(`Starting migration v${version}: ${description}`);

    // Extend existing search_history table
    // SQLite ALTER TABLE ADD COLUMN does not support multiple columns in one statement.
    const addColumns = [
      "ALTER TABLE search_history ADD COLUMN providerId TEXT;",
      "ALTER TABLE search_history ADD COLUMN searchType TEXT DEFAULT 'keyword';",
      "ALTER TABLE search_history ADD COLUMN queryIntent TEXT;",
      "ALTER TABLE search_history ADD COLUMN executionTimeMs INTEGER;",
      "ALTER TABLE search_history ADD COLUMN resultCount INTEGER;",
      "ALTER TABLE search_history ADD COLUMN cacheHit INTEGER DEFAULT 0;",
      "ALTER TABLE search_history ADD COLUMN searchSessionId TEXT;"
    ];

    for (const statement of addColumns) {
      try {
        await db.execAsync(statement);
      } catch (err) {
        // Ignore errors if columns already exist (e.g. repeated runs)
        if (!err.message.includes('duplicate column name')) {
          throw err;
        }
      }
    }

    // Search Providers
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_providers (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        version TEXT NOT NULL,
        capabilities TEXT, -- JSON array
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Federated Indexes (Metadata Cache)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS federated_indexes (
        id TEXT PRIMARY KEY,
        providerId TEXT NOT NULL,
        externalId TEXT NOT NULL,
        title TEXT NOT NULL,
        displayName TEXT,
        url TEXT,
        documentType TEXT,
        lastModified TEXT,
        permissionHash TEXT,
        classification TEXT,
        snippet TEXT, -- Max 200 chars
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        UNIQUE(providerId, externalId),
        FOREIGN KEY (providerId) REFERENCES search_providers(id) ON DELETE CASCADE
      );
    `);

    // Search Cache (For query results)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_cache (
        id TEXT PRIMARY KEY,
        queryHash TEXT NOT NULL UNIQUE,
        results TEXT NOT NULL, -- JSON
        expiresAt TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // Saved Searches
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_searches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        query TEXT NOT NULL,
        filters TEXT, -- JSON
        searchType TEXT DEFAULT 'keyword',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Search Analytics (Pre-aggregated)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_analytics (
        id TEXT PRIMARY KEY,
        period TEXT NOT NULL, -- e.g., '2023-10-25' for daily
        totalQueries INTEGER DEFAULT 0,
        averageResponseTimeMs INTEGER DEFAULT 0,
        zeroResultCount INTEGER DEFAULT 0,
        providerUsage TEXT, -- JSON mapping providerId -> count
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        UNIQUE(period)
      );
    `);

    // Search Suggestions
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_suggestions (
        id TEXT PRIMARY KEY,
        suggestion TEXT NOT NULL,
        suggestionType TEXT NOT NULL, -- 'recent' | 'popular' | 'related' | 'ai'
        score REAL DEFAULT 0.0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Provider Health
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS provider_health (
        id TEXT PRIMARY KEY,
        providerId TEXT NOT NULL,
        status TEXT NOT NULL, -- 'healthy' | 'degraded' | 'down'
        latencyMs INTEGER,
        lastCheckAt TEXT NOT NULL,
        details TEXT, -- JSON
        FOREIGN KEY (providerId) REFERENCES search_providers(id) ON DELETE CASCADE
      );
    `);

    Logger.info(`Completed migration v${version}: ${description}`);
  } catch (error) {
    Logger.error(`Migration v${version} failed`, error);
    throw error;
  }
}

export async function down(db) {
  try {
    Logger.info(`Reverting migration v${version}`);

    await db.execAsync('DROP TABLE IF EXISTS provider_health');
    await db.execAsync('DROP TABLE IF EXISTS search_suggestions');
    await db.execAsync('DROP TABLE IF EXISTS search_analytics');
    await db.execAsync('DROP TABLE IF EXISTS saved_searches');
    await db.execAsync('DROP TABLE IF EXISTS search_cache');
    await db.execAsync('DROP TABLE IF EXISTS federated_indexes');
    await db.execAsync('DROP TABLE IF EXISTS search_providers');

    // Note: We typically don't DROP columns in SQLite `down` migrations easily due to lack of DROP COLUMN support in older SQLite versions,
    // but Expo SQLite modern versions support it. We will leave them for data preservation unless strictly requested.

    Logger.info(`Successfully reverted migration v${version}`);
  } catch (error) {
    Logger.error(`Failed to revert migration v${version}`, error);
    throw error;
  }
}

export default { version, description, up, down };
