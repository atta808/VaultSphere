export default {
  version: 10,
  description: 'Phase 19 - AI Agent Platform & Automation Hub',
  up: async (db) => {
    // 1. agents table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        systemPrompt TEXT,
        type TEXT NOT NULL,
        capabilities TEXT,
        settings TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 2. agent_memory table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS agent_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        agentId INTEGER NOT NULL,
        contextType TEXT NOT NULL,
        contextData TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (agentId) REFERENCES agents (id) ON DELETE CASCADE
      );
    `);

    // 3. agent_executions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS agent_executions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        agentId INTEGER NOT NULL,
        status TEXT NOT NULL,
        triggerSource TEXT,
        inputData TEXT,
        outputData TEXT,
        errorData TEXT,
        startedAt TEXT,
        completedAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (agentId) REFERENCES agents (id) ON DELETE CASCADE
      );
    `);

    // 4. tool_registry table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tool_registry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        inputSchema TEXT,
        outputSchema TEXT,
        permissionRequirements TEXT,
        isEnabled INTEGER DEFAULT 1,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 5. scheduled_jobs table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scheduled_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        jobType TEXT NOT NULL,
        cronExpression TEXT,
        scheduleType TEXT NOT NULL,
        nextRunAt TEXT,
        isEnabled INTEGER DEFAULT 1,
        payload TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 6. job_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS job_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        jobId INTEGER NOT NULL,
        status TEXT NOT NULL,
        executionResult TEXT,
        errorData TEXT,
        startedAt TEXT NOT NULL,
        completedAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (jobId) REFERENCES scheduled_jobs (id) ON DELETE CASCADE
      );
    `);

    // 7. automation_jobs table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS automation_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        triggerEvent TEXT NOT NULL,
        conditions TEXT,
        actions TEXT NOT NULL,
        isEnabled INTEGER DEFAULT 1,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 8. automation_history table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS automation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        automationJobId INTEGER NOT NULL,
        triggerPayload TEXT,
        status TEXT NOT NULL,
        executionResult TEXT,
        errorData TEXT,
        startedAt TEXT NOT NULL,
        completedAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (automationJobId) REFERENCES automation_jobs (id) ON DELETE CASCADE
      );
    `);

    // 9. insights table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        sourceType TEXT,
        sourceId TEXT,
        confidenceScore REAL DEFAULT 1.0,
        actions TEXT,
        isDismissed INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 10. prompt_templates table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS prompt_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        template TEXT NOT NULL,
        variables TEXT,
        version INTEGER DEFAULT 1,
        isSystem INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_agents_uuid ON agents(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_agent_memory_uuid ON agent_memory(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_agent_memory_agent ON agent_memory(agentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_agent_executions_uuid ON agent_executions(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_agent_executions_agent ON agent_executions(agentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_tool_registry_uuid ON tool_registry(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_tool_registry_name ON tool_registry(name);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_uuid ON scheduled_jobs(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_job_history_uuid ON job_history(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_job_history_job ON job_history(jobId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_automation_jobs_uuid ON automation_jobs(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_automation_history_uuid ON automation_history(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_automation_history_job ON automation_history(automationJobId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_insights_uuid ON insights(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_prompt_templates_uuid ON prompt_templates(uuid);`);
  }
};
