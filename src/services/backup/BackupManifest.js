import { generateManifest } from '../../utils/manifestHelpers';

class BackupManifest {
  async create(manifestData) {
    return await generateManifest(manifestData);
  }
}

export default new BackupManifest();
