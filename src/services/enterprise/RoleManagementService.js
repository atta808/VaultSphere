import { EnterpriseRoleRepository } from '../../database/repositories/enterprise/EnterpriseRoleRepository';

export class RoleManagementService {
  constructor() {
    this.roleRepo = new EnterpriseRoleRepository();
  }

  async createRole(data) {
    return await this.roleRepo.create(data);
  }
}

export const roleManagementService = new RoleManagementService();
