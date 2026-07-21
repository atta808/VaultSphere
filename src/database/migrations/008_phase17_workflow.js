export default {
  version: 8,
  description: 'Phase 17 - Workflow Automation, Digital Signatures & Business Process Engine schema',
  up: async (db) => {
    // 1. workflow_templates table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workflow_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        isEnabled INTEGER DEFAULT 1,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 2. workflows table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workflows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        templateId INTEGER,
        documentId INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        createdBy TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (templateId) REFERENCES workflow_templates (id) ON DELETE SET NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 3. workflow_steps table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workflow_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        workflowId INTEGER,
        templateId INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        stepOrder INTEGER NOT NULL,
        stepType TEXT DEFAULT 'sequential',
        assignedTo TEXT,
        status TEXT DEFAULT 'pending',
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workflowId) REFERENCES workflows (id) ON DELETE CASCADE,
        FOREIGN KEY (templateId) REFERENCES workflow_templates (id) ON DELETE CASCADE
      );
    `);

    // 4. workflow_instances table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workflow_instances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        workflowId INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        startedAt TEXT,
        completedAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workflowId) REFERENCES workflows (id) ON DELETE CASCADE
      );
    `);

    // 5. approvals table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS approvals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        workflowInstanceId INTEGER,
        stepId INTEGER,
        documentId INTEGER,
        approverId TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        comments TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (workflowInstanceId) REFERENCES workflow_instances (id) ON DELETE CASCADE,
        FOREIGN KEY (stepId) REFERENCES workflow_steps (id) ON DELETE SET NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 6. approval_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS approval_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        approvalId INTEGER NOT NULL,
        action TEXT NOT NULL,
        userId TEXT NOT NULL,
        comments TEXT,
        timestamp TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (approvalId) REFERENCES approvals (id) ON DELETE CASCADE
      );
    `);

    // 7. tasks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        dueDate TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        assignedUserId TEXT,
        assignedWorkspaceId INTEGER,
        documentId INTEGER,
        workflowId INTEGER,
        startedAt TEXT,
        completedAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (assignedWorkspaceId) REFERENCES workspaces (id) ON DELETE SET NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE SET NULL,
        FOREIGN KEY (workflowId) REFERENCES workflows (id) ON DELETE SET NULL
      );
    `);

    // 8. automation_rules table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS automation_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        eventType TEXT NOT NULL,
        conditions TEXT,
        actions TEXT,
        isEnabled INTEGER DEFAULT 1,
        executionOrder INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 9. reminders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        targetId INTEGER,
        targetType TEXT NOT NULL,
        userId TEXT NOT NULL,
        scheduledFor TEXT NOT NULL,
        isSent INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 10. signatures table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS signatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        documentId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        userName TEXT,
        signatureHash TEXT NOT NULL,
        documentHash TEXT NOT NULL,
        signatureImage TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 11. signature_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS signature_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        signatureId INTEGER NOT NULL,
        action TEXT NOT NULL,
        userId TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (signatureId) REFERENCES signatures (id) ON DELETE CASCADE
      );
    `);

    // 12. document_lifecycle table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_lifecycle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        documentId INTEGER NOT NULL,
        state TEXT NOT NULL,
        changedBy TEXT NOT NULL,
        changedAt TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workflow_templates_uuid ON workflow_templates(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workflows_uuid ON workflows(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workflows_documentId ON workflows(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflowId ON workflow_steps(workflowId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_workflow_instances_workflowId ON workflow_instances(workflowId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_approvals_workflowInstanceId ON approvals(workflowInstanceId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_approvals_documentId ON approvals(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_tasks_uuid ON tasks(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_tasks_assignedUserId ON tasks(assignedUserId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_automation_rules_uuid ON automation_rules(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_reminders_userId ON reminders(userId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_signatures_documentId ON signatures(documentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_lifecycle_documentId ON document_lifecycle(documentId);`);
  }
};
