export default {
  version: 2,
  description: 'Add OCR and AI Document Intelligence schema',
  up: async (db) => {
    // 1. ocr_results
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ocr_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        text TEXT NOT NULL,
        language TEXT,
        confidence REAL,
        processingTime INTEGER,
        provider TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 2. document_analysis
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        classification TEXT,
        confidence REAL,
        provider TEXT NOT NULL,
        analyzedAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 3. document_entities
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_entities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        confidence REAL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 4. document_keywords
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_keywords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        keyword TEXT NOT NULL,
        type TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 5. document_summaries
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        shortSummary TEXT,
        mediumSummary TEXT,
        longSummary TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 6. search_index
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS search_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        weight INTEGER DEFAULT 1,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_ocr_results_documentId ON ocr_results(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_analysis_documentId ON document_analysis(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_entities_documentId ON document_entities(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_entities_type ON document_entities(type);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_keywords_documentId ON document_keywords(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_keywords_keyword ON document_keywords(keyword);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_summaries_documentId ON document_summaries(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_search_index_documentId ON search_index(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_search_index_type ON search_index(type);`);
  }
};
