import { ComplianceReportRepository } from '../../database/repositories/enterprise/ComplianceReportRepository';

export class ComplianceReportingService {
  constructor() {
    this.reportRepo = new ComplianceReportRepository();
  }

  async generateReport(data) {
    return await this.reportRepo.create(data);
  }
}

export const complianceReportingService = new ComplianceReportingService();
