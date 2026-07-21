import AuditTrailRepository from '../../database/repositories/collaboration/AuditTrailRepository';

class AuditTrailService {
  async logAction(userId, action, resourceType = null, resourceId = null, details = {}) {
    const timestamp = new Date().toISOString();
    return AuditTrailRepository.create({
      userId,
      deviceId: 'local', // Assuming local device for now
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : null,
      details: JSON.stringify(details),
      timestamp
    });
  }

  async getAuditLogs(limit = 100, offset = 0) {
    return AuditTrailRepository.findAll({ orderBy: 'timestamp DESC', limit, offset });
  }
}

export default new AuditTrailService();
