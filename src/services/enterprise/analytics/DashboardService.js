import * as Crypto from 'expo-crypto';
import { DashboardRepository } from '../../../database/repositories/enterprise/analytics/DashboardRepository';
import { DashboardWidgetRepository } from '../../../database/repositories/enterprise/analytics/DashboardWidgetRepository';
import PermissionService from '../../collaboration/PermissionService';
import AuditTrailService from '../../collaboration/AuditTrailService';

export class DashboardService {
  static async getDashboards(userId) {
    const hasAccess = await PermissionService.checkPermission(userId, 'analytics', 'dashboard', 'viewer');
    if (!hasAccess) {
      throw new Error('Unauthorized to view analytics');
    }

    const repo = new DashboardRepository();
    return await repo.findAll();
  }

  static async getWidgetsForDashboard(dashboardId, userId) {
    const hasAccess = await PermissionService.checkPermission(userId, 'analytics', 'dashboard', 'viewer');
    if (!hasAccess) {
      throw new Error('Unauthorized to view analytics');
    }

    const repo = new DashboardWidgetRepository();
    return await repo.findAll({ where: { dashboardId } });
  }

  static async initializeDefaultDashboardIfNeeded(userId) {
    const repo = new DashboardRepository();
    const widgetRepo = new DashboardWidgetRepository();

    const existing = await repo.findAll({ where: { isDefault: 1, type: 'system' } });

    if (existing.length === 0) {
      const dashboardId = Crypto.randomUUID();
      const now = new Date().toISOString();

      await repo.create({
        id: dashboardId,
        name: 'Executive Dashboard',
        description: 'Default system executive dashboard',
        type: 'system',
        isDefault: 1,
        layout: '{}',
        createdAt: now,
        updatedAt: now
      });

      // Audit the creation of the system dashboard
      await AuditTrailService.logAction(userId || 'system', 'DASHBOARD_CREATED', 'DASHBOARD', dashboardId, { details: 'System default dashboard initialized.' });

      // Add default widgets
      const widgets = [
        { title: 'Total Documents', type: 'kpi_card', source: 'docs_total' },
        { title: 'Storage Usage', type: 'kpi_card', source: 'storage_usage' },
        { title: 'Pending Approvals', type: 'kpi_card', source: 'approvals_pending' },
      ];

      for (const w of widgets) {
        await widgetRepo.create({
          id: Crypto.randomUUID(),
          dashboardId,
          title: w.title,
          widgetType: w.type,
          dataSource: w.source,
          config: '{}',
          createdAt: now,
          updatedAt: now
        });
      }
    }
  }

  static async updateDashboardConfig(dashboardId, layoutData, userId) {
    const hasAccess = await PermissionService.checkPermission(userId, 'analytics', 'dashboard', 'editor');
    if (!hasAccess) {
      throw new Error('Unauthorized to edit dashboards');
    }

    const repo = new DashboardRepository();
    await repo.update(dashboardId, { layout: JSON.stringify(layoutData) });

    await AuditTrailService.logAction(userId, 'DASHBOARD_CONFIG_UPDATED', 'DASHBOARD', dashboardId, { details: 'Dashboard configuration updated by user.' });
  }
}
