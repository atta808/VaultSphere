export default {
  version: 3,
  description: 'Add Search History and FTS5 Virtual Table',
  up: async (db) => {
    // 1. search_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        isPinned INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // 2. Index for fast lookup on search_history
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_search_history_updatedAt ON search_history(updatedAt DESC);`);

    // 3. search_index_fts (FTS5 virtual table)
    // FTS5 is a virtual table module. We do not use FOREIGN KEY inside FTS.
    // Instead we map it logically back to the document table using documentId.
    // We use the 'tokenize=porter unicode61' to support stemming and unicode if supported by the sqlite version,
    // though expo-sqlite default FTS5 usually supports simple tokenization and unicode.
    // We'll stick to basic tokenization (which often defaults to unicode61) or porter if available.
    // We will just use standard FTS5 without extra tokenizers to ensure compatibility.
    await db.execAsync(`
      CREATE VIRTUAL TABLE IF NOT EXISTS search_index_fts USING fts5(
        documentId UNINDEXED,
        filename,
        ocr,
        ai_keywords,
        ai_entities,
        ai_summary,
        tags,
        notes,
        metadata
      );
    `);
  }
};
