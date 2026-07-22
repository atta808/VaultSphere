import { AdministrationSettingRepository } from '../../database/repositories/enterprise/AdministrationSettingRepository';

export class EnterpriseAdministrationService {
  constructor() {
    this.settingsRepo = new AdministrationSettingRepository();
  }

  async getSetting(key) {
    const records = await this.settingsRepo.findBy({ key, deletedAt: null });
    return records.length > 0 ? records[0] : null;
  }

  async setSetting(key, value) {
    // Basic stub, real implementation would handle updates
    return await this.settingsRepo.create({ key, value });
  }
}

export const enterpriseAdministrationService = new EnterpriseAdministrationService();
