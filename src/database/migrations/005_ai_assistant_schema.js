export const up = async (db) => {
  console.log('Running migration: 005_ai_assistant_schema');

  // AI Conversations
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      tokenUsage INTEGER DEFAULT 0,
      isPinned INTEGER DEFAULT 0,
      isArchived INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      deletedAt INTEGER
    );
  `);

  // AI Messages
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      role TEXT NOT NULL, -- 'user', 'assistant', 'system'
      content TEXT NOT NULL,
      citations TEXT, -- JSON array of citations
      createdAt INTEGER NOT NULL,
      deletedAt INTEGER,
      FOREIGN KEY (conversationId) REFERENCES ai_conversations(id) ON DELETE CASCADE
    );
  `);

  // AI Conversation Documents (Many-to-Many)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_conversation_documents (
      conversationId TEXT NOT NULL,
      documentId TEXT NOT NULL,
      PRIMARY KEY (conversationId, documentId),
      FOREIGN KEY (conversationId) REFERENCES ai_conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // AI Extracted Entities
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_entities (
      id TEXT PRIMARY KEY,
      documentId TEXT NOT NULL,
      entityType TEXT NOT NULL, -- e.g., 'name', 'date', 'amount'
      entityValue TEXT NOT NULL,
      confidence REAL,
      extractedAt INTEGER NOT NULL,
      deletedAt INTEGER,
      FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // AI Summaries
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_summaries (
      id TEXT PRIMARY KEY,
      documentId TEXT NOT NULL,
      summaryText TEXT NOT NULL,
      keyPoints TEXT, -- JSON array
      generatedAt INTEGER NOT NULL,
      deletedAt INTEGER,
      FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // AI Comparisons
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_comparisons (
      id TEXT PRIMARY KEY,
      documentAId TEXT NOT NULL,
      documentBId TEXT NOT NULL,
      similarityScore REAL,
      changeSummary TEXT,
      diffData TEXT, -- JSON string of diffs or a reference to it
      comparedAt INTEGER NOT NULL,
      deletedAt INTEGER,
      FOREIGN KEY (documentAId) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (documentBId) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // AI Prompts (Future-ready)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ai_prompts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      promptText TEXT NOT NULL,
      isSystem INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      deletedAt INTEGER
    );
  `);

  // Create indexes for performance
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_ai_messages_conversationId ON ai_messages(conversationId);
    CREATE INDEX IF NOT EXISTS idx_ai_entities_documentId ON ai_entities(documentId);
    CREATE INDEX IF NOT EXISTS idx_ai_summaries_documentId ON ai_summaries(documentId);
    CREATE INDEX IF NOT EXISTS idx_ai_comparisons_docA ON ai_comparisons(documentAId);
    CREATE INDEX IF NOT EXISTS idx_ai_comparisons_docB ON ai_comparisons(documentBId);
  `);

  console.log('Migration 005_ai_assistant_schema completed.');
};

export const down = async (db) => {
  console.log('Rolling back migration: 005_ai_assistant_schema');

  await db.execAsync(`
    DROP INDEX IF EXISTS idx_ai_comparisons_docB;
    DROP INDEX IF EXISTS idx_ai_comparisons_docA;
    DROP INDEX IF EXISTS idx_ai_summaries_documentId;
    DROP INDEX IF EXISTS idx_ai_entities_documentId;
    DROP INDEX IF EXISTS idx_ai_messages_conversationId;

    DROP TABLE IF EXISTS ai_prompts;
    DROP TABLE IF EXISTS ai_comparisons;
    DROP TABLE IF EXISTS ai_summaries;
    DROP TABLE IF EXISTS ai_entities;
    DROP TABLE IF EXISTS ai_conversation_documents;
    DROP TABLE IF EXISTS ai_messages;
    DROP TABLE IF EXISTS ai_conversations;
  `);

  console.log('Rollback of migration 005_ai_assistant_schema completed.');
};
