import initialSchema from './migrations/001_initial_schema';
import { Logger } from '../utils/logger/Logger';
import ocrAiSchema from './migrations/002_ocr_ai_schema';
import searchHistorySchema from './migrations/003_search_history_schema';
import documentViewerSchema from './migrations/004_document_viewer_schema';
import * as aiAssistantSchema from './migrations/005_ai_assistant_schema';
import phase14Annotations from './migrations/006_phase14_annotations';
import phase16Collaboration from './migrations/007_phase16_collaboration';
import phase17Workflow from './migrations/008_phase17_workflow';
import phase18KnowledgeGraph from './migrations/009_phase18_knowledge_graph';
import phase19AgentPlatform from './migrations/010_phase19_agent_platform';
import phase20EnterpriseGovernance from './migrations/011_phase20_enterprise_governance';
import phase21Analytics from './migrations/012_phase21_analytics';
import { MigrationError } from './utils/errors';

// Normalize migration 005 since it doesn't have version/description exported
const aiAssistantMigration = {
  version: 5,
  description: 'AI Assistant & Intelligent Workspace schema',
  up: aiAssistantSchema.up,
  down: aiAssistantSchema.down,
};

// Array of all migrations in order
const migrations = [
  initialSchema,
  ocrAiSchema,
  searchHistorySchema,
  documentViewerSchema,
  aiAssistantMigration,
  phase14Annotations,
  phase16Collaboration,
  phase17Workflow,
  phase18KnowledgeGraph,
  phase19AgentPlatform,
  phase20EnterpriseGovernance,
  phase21Analytics,
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
