import BaseRepository from '../BaseRepository';

class ToolRegistryRepository extends BaseRepository {
  constructor() {
    super('tool_registry');
    this.hasSoftDeletes = true;
  }

  async getActiveTools() {
    return this.findBy({ isEnabled: 1 });
  }
}

export default new ToolRegistryRepository();
