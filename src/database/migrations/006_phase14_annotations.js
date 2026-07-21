export default {
  version: 6,
  description: 'Advanced document annotations and viewer schemas',
  up: async (db) => {
    // Add missing columns to document_annotations (author, metadata, etc.)
    // SQLite alter table supports adding columns.

    // Check existing columns first (safeguard since SQLite has limited ALTER TABLE)
    const tableInfo = await db.getAllAsync("PRAGMA table_info(document_annotations);");
    const columns = tableInfo.map(c => c.name);

    if (!columns.includes('author')) {
      await db.execAsync('ALTER TABLE document_annotations ADD COLUMN author TEXT;');
    }
    if (!columns.includes('metadata')) {
      await db.execAsync('ALTER TABLE document_annotations ADD COLUMN metadata TEXT;'); // JSON
    }

    // Recent Pages (for reading history / recent pages across documents)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS recent_pages (
        id TEXT PRIMARY KEY,
        documentId TEXT NOT NULL,
        pageNumber INTEGER NOT NULL,
        accessedAt TEXT NOT NULL,
        duration INTEGER DEFAULT 0,
        FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_recent_pages_doc_id ON recent_pages(documentId);
    `);

    // Add reading duration to reading_positions to track time spent
    const positionsInfo = await db.getAllAsync("PRAGMA table_info(reading_positions);");
    const posColumns = positionsInfo.map(c => c.name);

    if (!posColumns.includes('durationSeconds')) {
      await db.execAsync('ALTER TABLE reading_positions ADD COLUMN durationSeconds INTEGER DEFAULT 0;');
    }
  }
};
