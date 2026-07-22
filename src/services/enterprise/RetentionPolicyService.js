import { RetentionPolicyRepository } from '../../database/repositories/enterprise/RetentionPolicyRepository';
import { RetentionPolicyAssignmentRepository } from '../../database/repositories/enterprise/RetentionPolicyAssignmentRepository';

export class RetentionPolicyService {
  constructor() {
    this.policyRepo = new RetentionPolicyRepository();
    this.assignmentRepo = new RetentionPolicyAssignmentRepository();
  }

  async createPolicy(data) {
    return await this.policyRepo.create(data);
  }

  async assignPolicy(retentionPolicyId, entityType, entityId, priority = 0) {
    return await this.assignmentRepo.create({
      retentionPolicyId,
      entityType,
      entityId,
      priority
    });
  }
}

export const retentionPolicyService = new RetentionPolicyService();
