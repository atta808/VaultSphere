export default {
  version: 11,
  description: 'Phase 20 - Enterprise Content Management (ECM) and Governance',
  up: async (db) => {
    // 1. organizations
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS organizations (
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

    // 2. departments
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        organizationId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (organizationId) REFERENCES organizations (id) ON DELETE CASCADE
      );
    `);

    // 3. teams
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        departmentId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (departmentId) REFERENCES departments (id) ON DELETE CASCADE
      );
    `);

    // 4. enterprise_roles
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS enterprise_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        permissions TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 5. organization_members
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS organization_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        organizationId INTEGER NOT NULL,
        userId TEXT NOT NULL, -- Assuming generic user ID reference for future use/current local user
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (organizationId) REFERENCES organizations (id) ON DELETE CASCADE
      );
    `);

    // 6. department_members
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS department_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        departmentId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (departmentId) REFERENCES departments (id) ON DELETE CASCADE
      );
    `);

    // 7. team_members
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        teamId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
      );
    `);

    // 8. user_roles
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        roleId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (roleId) REFERENCES enterprise_roles (id) ON DELETE CASCADE
      );
    `);

    // 9. record_series
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS record_series (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        description TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 10. records
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        documentId INTEGER NOT NULL,
        recordSeriesId INTEGER,
        status TEXT NOT NULL, -- Active, Archived, Inactive, Disposal Candidate, Permanent
        declaredAt TEXT NOT NULL,
        declaredBy TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (recordSeriesId) REFERENCES record_series (id) ON DELETE SET NULL
      );
    `);

    // 11. retention_policies
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS retention_policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        duration TEXT NOT NULL, -- Could be a specific duration or "Permanent"
        action TEXT NOT NULL, -- Destroy, Archive, etc.
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 12. retention_policy_assignments (polymorphic)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS retention_policy_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        retentionPolicyId INTEGER NOT NULL,
        entityType TEXT NOT NULL, -- Organization, Department, Team, Workspace, Folder, Document Type, Category, Record Series
        entityId INTEGER NOT NULL,
        priority INTEGER DEFAULT 0,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (retentionPolicyId) REFERENCES retention_policies (id) ON DELETE CASCADE
      );
    `);

    // 13. legal_holds
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS legal_holds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        reason TEXT NOT NULL,
        ownerId TEXT NOT NULL,
        status TEXT NOT NULL, -- Active, Released
        expiresAt TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 14. legal_hold_documents
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS legal_hold_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        legalHoldId INTEGER NOT NULL,
        documentId INTEGER NOT NULL,
        addedAt TEXT NOT NULL,
        addedBy TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT,
        FOREIGN KEY (legalHoldId) REFERENCES legal_holds (id) ON DELETE CASCADE,
        FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
      );
    `);

    // 15. document_classifications (polymorphic)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS document_classifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        entityType TEXT NOT NULL, -- Document, Folder, Workspace, Department, Organization
        entityId INTEGER NOT NULL,
        classificationLevel TEXT NOT NULL, -- Public, Internal, Confidential, Restricted, Highly Restricted
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 16. governance_rules
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS governance_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        ruleType TEXT NOT NULL,
        conditions TEXT NOT NULL,
        actions TEXT NOT NULL,
        priority INTEGER DEFAULT 0,
        isEnabled INTEGER DEFAULT 1,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 17. compliance_frameworks
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS compliance_frameworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        description TEXT,
        controls TEXT,
        requirements TEXT,
        status TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 18. compliance_reports
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS compliance_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        reportType TEXT NOT NULL,
        parameters TEXT,
        results TEXT,
        generatedAt TEXT,
        generatedBy TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // 19. administration_settings
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS administration_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        metadata TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deletedAt TEXT
      );
    `);

    // Indexes
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_organizations_uuid ON organizations(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_departments_uuid ON departments(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_departments_org ON departments(organizationId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_teams_uuid ON teams(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_teams_dept ON teams(departmentId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_enterprise_roles_uuid ON enterprise_roles(uuid);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_org_members_uuid ON organization_members(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organizationId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_dept_members_uuid ON department_members(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_dept_members_dept ON department_members(departmentId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_team_members_uuid ON team_members(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(teamId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_user_roles_uuid ON user_roles(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(roleId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_record_series_uuid ON record_series(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_record_series_code ON record_series(code);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_records_uuid ON records(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_records_doc ON records(documentId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_retention_policies_uuid ON retention_policies(uuid);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_retention_assignments_uuid ON retention_policy_assignments(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_retention_assignments_policy ON retention_policy_assignments(retentionPolicyId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_retention_assignments_entity ON retention_policy_assignments(entityType, entityId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_legal_holds_uuid ON legal_holds(uuid);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_legal_hold_docs_uuid ON legal_hold_documents(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_legal_hold_docs_hold ON legal_hold_documents(legalHoldId);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_legal_hold_docs_doc ON legal_hold_documents(documentId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_classifications_uuid ON document_classifications(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_document_classifications_entity ON document_classifications(entityType, entityId);`);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_governance_rules_uuid ON governance_rules(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_compliance_frameworks_uuid ON compliance_frameworks(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_compliance_reports_uuid ON compliance_reports(uuid);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_administration_settings_uuid ON administration_settings(uuid);`);
  }
};
