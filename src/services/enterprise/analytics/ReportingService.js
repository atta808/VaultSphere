import * as Crypto from 'expo-crypto';
import { ReportRepository } from '../../../database/repositories/enterprise/analytics/ReportRepository';
import PermissionService from '../../collaboration/PermissionService';
import AuditTrailService from '../../collaboration/AuditTrailService';

export class ReportingService {
  static async getReports(userId) {
    const hasAccess = await PermissionService.checkPermission(userId, 'analytics', 'reports', 'viewer');
    if (!hasAccess) {
      throw new Error('Unauthorized to view reports');
    }
    const repo = new ReportRepository();
    return await repo.findAll({ orderBy: 'createdAt DESC' });
  }

  static async generateReport(name, definition, userId) {
    const hasAccess = await PermissionService.checkPermission(userId, 'analytics', 'reports', 'editor');
    if (!hasAccess) {
      throw new Error('Unauthorized to generate reports');
    }

    const repo = new ReportRepository();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    await repo.create({
      id,
      name,
      description: 'Generated Report',
      status: 'ready',
      data: JSON.stringify(definition),
      createdAt: now,
      updatedAt: now
    });

    await AuditTrailService.logAction(userId, 'REPORT_GENERATED', 'REPORT', id, { details: `Report '${name}' generated.` });

    return id;
  }
}
