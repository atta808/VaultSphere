import ActivityRepository from '../../database/repositories/collaboration/ActivityRepository';

class ActivityService {
  async logActivity(workspaceId, userId, action, resourceType = null, resourceId = null, details = {}) {
    return ActivityRepository.create({
      workspaceId,
      userId,
      action,
      resourceType,
      resourceId,
      details: JSON.stringify(details),
    });
  }

  async getActivitiesForWorkspace(workspaceId, limit = 50, offset = 0) {
    return ActivityRepository.findAll({
      where: { workspaceId },
      orderBy: 'createdAt DESC',
      limit,
      offset
    });
  }
}

export default new ActivityService();
