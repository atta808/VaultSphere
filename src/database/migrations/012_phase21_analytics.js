export default {
  version: 12,
  description: 'Phase 21 - Enterprise Analytics, Business Intelligence & Executive Dashboard Platform',
  up: async (db) => {
    await db.execAsync(`
      -- Core Analytics Events
      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        eventType TEXT NOT NULL,
        entityId TEXT,
        entityType TEXT,
        userId TEXT,
        metadata TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(eventType);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(createdAt);

      -- Analytics Snapshots (Aggregated Data)
      CREATE TABLE IF NOT EXISTS analytics_snapshots (
        id TEXT PRIMARY KEY,
        snapshotType TEXT NOT NULL, -- e.g., 'daily', 'weekly', 'monthly'
        category TEXT NOT NULL,
        data TEXT NOT NULL, -- JSON
        periodStart TEXT NOT NULL,
        periodEnd TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_period ON analytics_snapshots(periodStart, periodEnd);

      -- Dashboard Configurations
      CREATE TABLE IF NOT EXISTS dashboard_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL, -- 'user', 'organization', 'system'
        isDefault INTEGER DEFAULT 0,
        layout TEXT NOT NULL, -- JSON
        userId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      -- Dashboard Widgets
      CREATE TABLE IF NOT EXISTS dashboard_widgets (
        id TEXT PRIMARY KEY,
        dashboardId TEXT NOT NULL,
        title TEXT NOT NULL,
        widgetType TEXT NOT NULL, -- 'kpi_card', 'line_chart', etc.
        dataSource TEXT NOT NULL, -- Identifier for metrics/analytics
        config TEXT, -- JSON
        position TEXT, -- JSON (x, y, w, h)
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (dashboardId) REFERENCES dashboard_configs(id) ON DELETE CASCADE
      );

      -- KPIs
      CREATE TABLE IF NOT EXISTS kpis (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        formulaIdentifier TEXT NOT NULL,
        unit TEXT NOT NULL,
        currentValue REAL,
        previousValue REAL,
        trendDirection TEXT, -- 'up', 'down', 'flat'
        targetValue REAL,
        thresholds TEXT, -- JSON
        lastCalculated TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      -- KPI History
      CREATE TABLE IF NOT EXISTS kpi_history (
        id TEXT PRIMARY KEY,
        kpiId TEXT NOT NULL,
        value REAL NOT NULL,
        calculatedAt TEXT NOT NULL,
        FOREIGN KEY (kpiId) REFERENCES kpis(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_kpi_history_kpi ON kpi_history(kpiId, calculatedAt);

      -- Reports
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        templateId TEXT,
        status TEXT NOT NULL, -- 'draft', 'generating', 'ready', 'failed'
        data TEXT, -- JSON payload of the generated report
        exportMetadata TEXT, -- JSON
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      -- Report Templates
      CREATE TABLE IF NOT EXISTS report_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        definition TEXT NOT NULL, -- JSON definition of charts/metrics
        filters TEXT, -- JSON
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      -- Trend Snapshots
      CREATE TABLE IF NOT EXISTS trend_snapshots (
        id TEXT PRIMARY KEY,
        metric TEXT NOT NULL,
        trendType TEXT NOT NULL,
        value REAL NOT NULL,
        snapshotDate TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      -- Executive Insights
      CREATE TABLE IF NOT EXISTS executive_insights (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        narrative TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT DEFAULT 'normal', -- 'high', 'normal', 'low'
        relatedData TEXT, -- JSON
        createdAt TEXT NOT NULL
      );
    `);
  },
  down: async (db) => {
    // In a production app, dropping might be restricted, but defined here for completeness
    await db.execAsync(`
      DROP TABLE IF EXISTS executive_insights;
      DROP TABLE IF EXISTS trend_snapshots;
      DROP TABLE IF EXISTS report_templates;
      DROP TABLE IF EXISTS reports;
      DROP TABLE IF EXISTS kpi_history;
      DROP TABLE IF EXISTS kpis;
      DROP TABLE IF EXISTS dashboard_widgets;
      DROP TABLE IF EXISTS dashboard_configs;
      DROP TABLE IF EXISTS analytics_snapshots;
      DROP TABLE IF EXISTS analytics_events;
    `);
  }
};
