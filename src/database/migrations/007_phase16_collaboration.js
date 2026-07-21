export default {
  version: 7,
  description: 'Phase 16 - Secure Sharing, Collaboration & Audit Trail schema',
  up: async (db) => {
    // 1. workspaces table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        ownerUserId TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 2. workspace_members table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workspace_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspaceId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'viewer',
        status TEXT DEFAULT 'active',
        joinedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workspaceId) REFERENCES workspaces (id) ON DELETE CASCADE
      );
    `);

    // 3. shared_documents table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shared_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspaceId INTEGER,
        documentId INTEGER NOT NULL,
        sharedByUserId TEXT NOT NULL,
        shareLink TEXT UNIQUE,
        expiresAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workspaceId) REFERENCES workspaces (id) ON DELETE SET NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 4. shared_folders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shared_folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspaceId INTEGER,
        folderId INTEGER NOT NULL,
        sharedByUserId TEXT NOT NULL,
        shareLink TEXT UNIQUE,
        expiresAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workspaceId) REFERENCES workspaces (id) ON DELETE SET NULL,
        FOREIGN KEY (folderId) REFERENCES folders (id) ON DELETE CASCADE
      );
    `);

    // 5. collaborators table
    // Tracks individuals invited to specific resources (if not using workspace role)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS collaborators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        email TEXT,
        status TEXT DEFAULT 'pending',
        invitedByUserId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 6. permissions table
    // Specific permissions on resources overriding or adding to default roles
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resourceType TEXT NOT NULL,
        resourceId INTEGER NOT NULL,
        collaboratorId INTEGER,
        workspaceMemberId INTEGER,
        role TEXT NOT NULL,
        expiresAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (collaboratorId) REFERENCES collaborators (id) ON DELETE CASCADE,
        FOREIGN KEY (workspaceMemberId) REFERENCES workspace_members (id) ON DELETE CASCADE
      );
    `);

    // 7. comments table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        documentId INTEGER NOT NULL,
        workspaceId INTEGER,
        pageNumber INTEGER,
        annotationId INTEGER,
        authorUserId TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        resolved INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (workspaceId) REFERENCES workspaces (id) ON DELETE SET NULL
      );
    `);

    // 8. comment_replies table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS comment_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        commentId INTEGER NOT NULL,
        authorUserId TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (commentId) REFERENCES comments (id) ON DELETE CASCADE
      );
    `);

    // 9. version_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS version_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        documentId INTEGER NOT NULL,
        versionNumber INTEGER NOT NULL,
        authorUserId TEXT NOT NULL,
        encryptedFilePath TEXT NOT NULL,
        versionNotes TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 10. audit_trail table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS audit_trail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        deviceId TEXT,
        action TEXT NOT NULL,
        resourceType TEXT,
        resourceId TEXT,
        details TEXT,
        timestamp TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // 11. activities table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspaceId INTEGER,
        userId TEXT NOT NULL,
        action TEXT NOT NULL,
        resourceType TEXT,
        resourceId INTEGER,
        details TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (workspaceId) REFERENCES workspaces (id) ON DELETE CASCADE
      );
    `);

    // 12. sync_queue table (foundational dependency for offline-first architecture)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        entityType TEXT NOT NULL,
        entityId TEXT,
        operation TEXT NOT NULL,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        retryCount INTEGER DEFAULT 0,
        priority INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workspaces_uuid ON workspaces(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workspace_members_workspaceId ON workspace_members(workspaceId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_shared_docs_docId ON shared_documents(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_shared_folders_folderId ON shared_folders(folderId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resourceType, resourceId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_comments_documentId ON comments(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_version_history_documentId ON version_history(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_audit_trail_timestamp ON audit_trail(timestamp);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_activities_workspaceId ON activities(workspaceId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);`);
  }
};
