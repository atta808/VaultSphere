import BaseRepository from './BaseRepository';

export class ViewerPreferenceRepository extends BaseRepository {
  constructor() {
    super('viewer_preferences');
  }

  async getPreferences() {
    const results = await this.findAll();
    return results.length > 0 ? results[0] : null;
  }

  async savePreferences(id, preferencesData) {
    const existing = await this.findById(id);
    if(existing) {
        return this.update(id, preferencesData);
    }
    return this.create({id, ...preferencesData});
  }
}
