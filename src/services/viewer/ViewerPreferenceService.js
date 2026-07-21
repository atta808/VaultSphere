import { ViewerPreferenceRepository } from '../../database/repositories/ViewerPreferenceRepository';

export class ViewerPreferenceService {
  constructor() {
    this.preferenceRepo = new ViewerPreferenceRepository();
    this.defaultPreferences = {
      defaultZoom: 1.0,
      readingMode: 'continuous',
      theme: 'system',
      showThumbnails: 1,
      rememberLastPage: 1
    };
  }

  async getPreferences() {
    const prefs = await this.preferenceRepo.getPreferences();
    return prefs || this.defaultPreferences;
  }

  async updatePreferences(preferencesData) {
    const prefsId = 'default_preferences_id'; // We can use a single row for global preferences
    return await this.preferenceRepo.savePreferences(prefsId, preferencesData);
  }
}

export default new ViewerPreferenceService();
