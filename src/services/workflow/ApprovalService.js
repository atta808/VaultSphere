import ApprovalRepository from '../../database/repositories/workflow/ApprovalRepository';
import ApprovalHistoryRepository from '../../database/repositories/workflow/ApprovalHistoryRepository';
import PermissionService from '../collaboration/PermissionService';
import AuditTrailService from '../collaboration/AuditTrailService';

class ApprovalService {
  async approve(approvalId, user, comments) {
    await PermissionService.validatePermission(user.id, 'approval', 'execute');

    await ApprovalRepository.update(approvalId, { status: 'approved' });

    await ApprovalHistoryRepository.create({
      approvalId,
      action: 'APPROVED',
      userId: user.id,
      comments,
      timestamp: new Date().toISOString()
    });

    await AuditTrailService.logAction(user.id, 'APPROVE_DOCUMENT', 'approval', approvalId);
  }

  async reject(approvalId, user, comments) {
    await PermissionService.validatePermission(user.id, 'approval', 'execute');

    await ApprovalRepository.update(approvalId, { status: 'rejected' });

    await ApprovalHistoryRepository.create({
      approvalId,
      action: 'REJECTED',
      userId: user.id,
      comments,
      timestamp: new Date().toISOString()
    });

    await AuditTrailService.logAction(user.id, 'REJECT_DOCUMENT', 'approval', approvalId);
  }
}

export default new ApprovalService();
