export default {
  version: 9,
  description: 'Phase 18 - Enterprise Knowledge Graph, Semantic Search & AI Intelligence Engine',
  up: async (db) => {
    // 1. knowledge_nodes table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS knowledge_nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        nodeType TEXT NOT NULL,
        displayName TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 2. knowledge_edges table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS knowledge_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        sourceNodeId INTEGER NOT NULL,
        targetNodeId INTEGER NOT NULL,
        relationshipType TEXT NOT NULL,
        confidenceScore REAL DEFAULT 1.0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (sourceNodeId) REFERENCES knowledge_nodes (id) ON DELETE CASCADE,
        FOREIGN KEY (targetNodeId) REFERENCES knowledge_nodes (id) ON DELETE CASCADE
      );
    `);

    // 3. embeddings table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        targetId TEXT NOT NULL,
        targetType TEXT NOT NULL,
        embeddingData TEXT NOT NULL,
        modelName TEXT NOT NULL,
        provider TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 4. semantic_index table (chunks of documents with their embedding id if any)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS semantic_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        documentId INTEGER NOT NULL,
        chunkIndex INTEGER NOT NULL,
        pageNumber INTEGER,
        characterOffset INTEGER,
        text TEXT NOT NULL,
        embeddingId INTEGER,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (embeddingId) REFERENCES embeddings (id) ON DELETE SET NULL
      );
    `);

    // 5. document_relationships table (higher level logical document links)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        sourceDocumentId INTEGER NOT NULL,
        targetDocumentId INTEGER NOT NULL,
        relationshipType TEXT NOT NULL,
        confidenceScore REAL DEFAULT 1.0,
        isManual INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (sourceDocumentId) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (targetDocumentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 6. ai_topics table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ai_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 7. ai_topic_documents table (many-to-many link)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ai_topic_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topicId INTEGER NOT NULL,
        documentId INTEGER NOT NULL,
        confidenceScore REAL DEFAULT 1.0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (topicId) REFERENCES ai_topics (id) ON DELETE CASCADE,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 8. recommendations table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        targetType TEXT NOT NULL,
        targetId TEXT NOT NULL,
        recommendationType TEXT NOT NULL,
        suggestedItemId TEXT NOT NULL,
        suggestedItemType TEXT NOT NULL,
        confidenceScore REAL DEFAULT 1.0,
        reason TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_uuid ON knowledge_nodes(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_knowledge_nodes_type ON knowledge_nodes(nodeType);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_knowledge_edges_uuid ON knowledge_edges(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_knowledge_edges_source ON knowledge_edges(sourceNodeId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_knowledge_edges_target ON knowledge_edges(targetNodeId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_embeddings_uuid ON embeddings(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_embeddings_target ON embeddings(targetType, targetId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_semantic_index_uuid ON semantic_index(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_semantic_index_doc ON semantic_index(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_relationships_uuid ON document_relationships(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_relationships_source ON document_relationships(sourceDocumentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_ai_topics_uuid ON ai_topics(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_ai_topic_docs ON ai_topic_documents(topicId, documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_recommendations_uuid ON recommendations(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_recommendations_target ON recommendations(targetType, targetId);`);
  }
};
