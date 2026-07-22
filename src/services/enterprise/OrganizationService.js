import { OrganizationRepository } from '../../database/repositories/enterprise/OrganizationRepository';

export class OrganizationService {
  constructor() {
    this.orgRepo = new OrganizationRepository();
  }

  async createOrganization(data) {
    return await this.orgRepo.create(data);
  }
}

export const organizationService = new OrganizationService();
