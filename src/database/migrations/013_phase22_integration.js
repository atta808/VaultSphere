import { Logger } from '../../utils/logger/Logger';

export const version = 13;
export const description = 'Phase 22 - Enterprise Integration Hub, Connectors, Webhooks, APIs';

export async function up(db) {
  try {
    Logger.info(`Starting migration v${version}: ${description}`);

    // Connectors
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS connectors (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'inactive',
        version TEXT NOT NULL,
        capabilities TEXT, -- JSON array of capabilities
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Connector Configs
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS connector_configs (
        id TEXT PRIMARY KEY,
        connectorId TEXT NOT NULL,
        configKey TEXT NOT NULL,
        configValue TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (connectorId) REFERENCES connectors(id) ON DELETE CASCADE
      );
    `);

    // Connector Credentials (Metadata only, secrets in SecureStore)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS connector_credentials (
        id TEXT PRIMARY KEY,
        connectorId TEXT NOT NULL,
        credentialType TEXT NOT NULL,
        secureStoreKey TEXT NOT NULL,
        expiresAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (connectorId) REFERENCES connectors(id) ON DELETE CASCADE
      );
    `);

    // Integration Jobs (general jobs)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS integration_jobs (
        id TEXT PRIMARY KEY,
        connectorId TEXT,
        jobType TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payload TEXT, -- JSON
        result TEXT, -- JSON
        retryCount INTEGER DEFAULT 0,
        nextRetryAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        completedAt TEXT,
        FOREIGN KEY (connectorId) REFERENCES connectors(id) ON DELETE CASCADE
      );
    `);

    // Integration History
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS integration_history (
        id TEXT PRIMARY KEY,
        connectorId TEXT,
        jobId TEXT,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT, -- JSON
        createdAt TEXT NOT NULL,
        FOREIGN KEY (connectorId) REFERENCES connectors(id) ON DELETE SET NULL,
        FOREIGN KEY (jobId) REFERENCES integration_jobs(id) ON DELETE SET NULL
      );
    `);

    // Webhooks
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS webhooks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        direction TEXT NOT NULL, -- 'incoming' | 'outgoing'
        secretKey TEXT, -- Reference or actual key if safe to store here, but usually metadata
        events TEXT, -- JSON array of subscribed events
        status TEXT NOT NULL DEFAULT 'active',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Webhook Deliveries
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS webhook_deliveries (
        id TEXT PRIMARY KEY,
        webhookId TEXT NOT NULL,
        eventId TEXT NOT NULL,
        eventType TEXT NOT NULL,
        payload TEXT, -- JSON
        status TEXT NOT NULL, -- 'pending' | 'success' | 'failed' | 'retrying'
        responseCode INTEGER,
        responseBody TEXT,
        retryCount INTEGER DEFAULT 0,
        nextRetryAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (webhookId) REFERENCES webhooks(id) ON DELETE CASCADE
      );
    `);

    // API Clients
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS api_clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // API Keys (Metadata)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        clientId TEXT NOT NULL,
        keyPrefix TEXT NOT NULL, -- first few chars for identification
        secureStoreKey TEXT NOT NULL,
        permissions TEXT, -- JSON
        expiresAt TEXT,
        lastUsedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        revokedAt TEXT,
        FOREIGN KEY (clientId) REFERENCES api_clients(id) ON DELETE CASCADE
      );
    `);

    // Import Jobs
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS import_jobs (
        id TEXT PRIMARY KEY,
        sourceType TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        totalItems INTEGER DEFAULT 0,
        processedItems INTEGER DEFAULT 0,
        failedItems INTEGER DEFAULT 0,
        config TEXT, -- JSON
        result TEXT, -- JSON
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        completedAt TEXT
      );
    `);

    // Export Jobs
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS export_jobs (
        id TEXT PRIMARY KEY,
        exportType TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        totalItems INTEGER DEFAULT 0,
        processedItems INTEGER DEFAULT 0,
        failedItems INTEGER DEFAULT 0,
        config TEXT, -- JSON
        result TEXT, -- JSON
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        completedAt TEXT
      );
    `);

    // Connector Health
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS connector_health (
        id TEXT PRIMARY KEY,
        connectorId TEXT NOT NULL,
        status TEXT NOT NULL, -- 'healthy' | 'degraded' | 'down'
        latencyMs INTEGER,
        lastCheckAt TEXT NOT NULL,
        details TEXT, -- JSON
        FOREIGN KEY (connectorId) REFERENCES connectors(id) ON DELETE CASCADE
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

    await db.execAsync('DROP TABLE IF EXISTS connector_health');
    await db.execAsync('DROP TABLE IF EXISTS export_jobs');
    await db.execAsync('DROP TABLE IF EXISTS import_jobs');
    await db.execAsync('DROP TABLE IF EXISTS api_keys');
    await db.execAsync('DROP TABLE IF EXISTS api_clients');
    await db.execAsync('DROP TABLE IF EXISTS webhook_deliveries');
    await db.execAsync('DROP TABLE IF EXISTS webhooks');
    await db.execAsync('DROP TABLE IF EXISTS integration_history');
    await db.execAsync('DROP TABLE IF EXISTS integration_jobs');
    await db.execAsync('DROP TABLE IF EXISTS connector_credentials');
    await db.execAsync('DROP TABLE IF EXISTS connector_configs');
    await db.execAsync('DROP TABLE IF EXISTS connectors');

    Logger.info(`Successfully reverted migration v${version}`);
  } catch (error) {
    Logger.error(`Failed to revert migration v${version}`, error);
    throw error;
  }
}

export default { version, description, up, down };
