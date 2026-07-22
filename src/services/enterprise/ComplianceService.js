import { ComplianceFrameworkRepository } from '../../database/repositories/enterprise/ComplianceFrameworkRepository';

export class ComplianceService {
  constructor() {
    this.frameworkRepo = new ComplianceFrameworkRepository();
  }

  async createFramework(data) {
    return await this.frameworkRepo.create(data);
  }
}

export const complianceService = new ComplianceService();
