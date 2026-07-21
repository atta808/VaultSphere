export default {
  version: 4,
  description: 'Document viewer schema',
  up: async (db) => {
    // Document Bookmarks
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_bookmarks (
        id TEXT PRIMARY KEY,
        documentId TEXT NOT NULL,
        title TEXT NOT NULL,
        pageNumber INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_document_bookmarks_doc_id ON document_bookmarks(documentId);
    `);

    // Document Annotations
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_annotations (
        id TEXT PRIMARY KEY,
        documentId TEXT NOT NULL,
        pageNumber INTEGER,
        x REAL,
        y REAL,
        width REAL,
        height REAL,
        type TEXT NOT NULL, -- highlight, note, drawing
        content TEXT,
        color TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_document_annotations_doc_id ON document_annotations(documentId);
    `);

    // Reading Positions
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_positions (
        documentId TEXT PRIMARY KEY,
        pageNumber INTEGER,
        zoomLevel REAL,
        scrollX REAL,
        scrollY REAL,
        lastOpenedAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
      );
    `);

    // Viewer Preferences
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS viewer_preferences (
        id TEXT PRIMARY KEY,
        defaultZoom REAL,
        readingMode TEXT, -- continuous, single
        theme TEXT,
        showThumbnails INTEGER,
        rememberLastPage INTEGER,
        updatedAt TEXT NOT NULL
      );
    `);
  }
};
