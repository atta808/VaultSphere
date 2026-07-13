import { readManifest } from '../../utils/manifestHelpers';
import { generateStringChecksum } from '../../utils/checksumHelpers';
import { ManifestError, ChecksumError, ValidationError } from '../../utils/errors/customErrors';
import Constants from 'expo-constants';

class BackupValidator {
  async validateManifest(manifestPath) {
    const manifest = await readManifest(manifestPath);

    if (!manifest.backupId || !manifest.version && !manifest.backupVersion) {
      throw new ManifestError('Invalid manifest structure: Missing backupId or version');
    }

    // Validate Checksum
    const originalChecksum = manifest.checksum;

    // Create a copy without checksum to re-verify
    const manifestToVerify = { ...manifest };
    delete manifestToVerify.checksum;

    const recomputedChecksum = await generateStringChecksum(JSON.stringify(manifestToVerify));

    if (originalChecksum !== recomputedChecksum) {
      throw new ChecksumError('Manifest checksum validation failed. The manifest may be corrupted or tampered with.');
    }

    return manifest;
  }

  async validateCompatibility(manifest) {
    // For now, any 1.x backupVersion is compatible
    const backupVersion = manifest.backupVersion || manifest.version;
    if (!backupVersion || !backupVersion.startsWith('1.')) {
      throw new ValidationError(`Unsupported backup version: ${backupVersion}`);
    }

    // We can also check databaseVersion if necessary, or let DB migrations handle it.

    return true;
  }

  async validateBackupIntegrity(backupPath) {
    // In Phase 9, this could check for the presence of database.db
    // and basic file checksums.
    // Full integrity check can be heavy, so we might just check files exist.
    const FileSystem = require('expo-file-system');

    const dbPath = `${backupPath}/database.db`;
    const dbInfo = await FileSystem.getInfoAsync(dbPath);

    if (!dbInfo.exists) {
      throw new ValidationError('Backup is missing database.db');
    }

    // Check if documents folder exists
    const docsPath = `${backupPath}/documents`;
    const docsInfo = await FileSystem.getInfoAsync(docsPath);

    if (!docsInfo.exists) {
      throw new ValidationError('Backup is missing documents folder');
    }

    return true;
  }
}

export default new BackupValidator();
