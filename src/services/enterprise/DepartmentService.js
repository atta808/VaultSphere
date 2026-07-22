import { DepartmentRepository } from '../../database/repositories/enterprise/DepartmentRepository';
import { TeamRepository } from '../../database/repositories/enterprise/TeamRepository';

export class DepartmentService {
  constructor() {
    this.deptRepo = new DepartmentRepository();
    this.teamRepo = new TeamRepository();
  }

  async createDepartment(data) {
    return await this.deptRepo.create(data);
  }

  async createTeam(data) {
    return await this.teamRepo.create(data);
  }
}

export const departmentService = new DepartmentService();
