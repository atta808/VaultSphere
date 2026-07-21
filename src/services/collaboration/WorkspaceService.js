import WorkspaceRepository from '../../database/repositories/collaboration/WorkspaceRepository';
import WorkspaceMemberRepository from '../../database/repositories/collaboration/WorkspaceMemberRepository';
import * as Crypto from 'expo-crypto';
import AuditTrailService from './AuditTrailService';
import ActivityService from './ActivityService';

class WorkspaceService {
  async createWorkspace(name, description, ownerUserId) {
    const uuid = Crypto.randomUUID();
    const workspace = await WorkspaceRepository.create({
      uuid,
      name,
      description,
      ownerUserId,
      status: 'active'
    });

    await WorkspaceMemberRepository.create({
      workspaceId: workspace.id,
      userId: ownerUserId,
      role: 'owner',
      status: 'active',
      joinedAt: new Date().toISOString()
    });

    await AuditTrailService.logAction(ownerUserId, 'WORKSPACE_CREATED', 'workspace', workspace.id, { name });
    await ActivityService.logActivity(workspace.id, ownerUserId, 'WORKSPACE_CREATED', 'workspace', workspace.id, { name });

    return workspace;
  }

  async getWorkspaces(userId) {
    const memberships = await WorkspaceMemberRepository.findBy({ userId });
    const workspaceIds = memberships.map(m => m.workspaceId);
    if (workspaceIds.length === 0) return [];

    const workspaces = [];
    for (const id of workspaceIds) {
      const w = await WorkspaceRepository.findById(id);
      if (w) workspaces.push(w);
    }
    return workspaces;
  }
}

export default new WorkspaceService();
