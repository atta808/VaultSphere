export default {
  version: 1,
  description: 'Initial database schema creation',
  up: async (db) => {
    // Enable Foreign Keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // 1. settings table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // 2. folders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        parentId INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (parentId) REFERENCES folders (id) ON DELETE CASCADE
      );
    `);

    // 3. categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT
      );
    `);

    // 4. tags table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT
      );
    `);

    // 5. documents table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        folderId INTEGER,
        categoryId INTEGER,
        name TEXT NOT NULL,
        originalName TEXT,
        extension TEXT,
        mimeType TEXT,
        size INTEGER,
        path TEXT,
        thumbnail TEXT,
        favorite INTEGER DEFAULT 0,
        encrypted INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (folderId) REFERENCES folders (id) ON DELETE SET NULL,
        FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE SET NULL
      );
    `);

    // 6. document_tags table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        tagId INTEGER NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
      );
    `);

    // 7. favorites table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 8. notifications table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT,
        type TEXT,
        isRead INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_uuid ON documents(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_folderId ON documents(folderId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_categoryId ON documents(categoryId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_favorite ON documents(favorite);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_createdAt ON documents(createdAt);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_updatedAt ON documents(updatedAt);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_deletedAt ON documents(deletedAt);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_documents_name ON documents(name);`);
  }
};
