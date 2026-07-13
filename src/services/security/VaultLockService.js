import SecuritySettingsService from './SecuritySettingsService';
import SessionService from './SessionService';

class VaultLockService {
  /**
   * Checks if the Vault requires authentication right now.
   * This is true if Vault Lock is enabled AND there is no active session.
   */
  async requiresAuthentication() {
    const isVaultLockEnabled = await SecuritySettingsService.isVaultLockEnabled();
    if (!isVaultLockEnabled) {
      return false;
    }

    // If vault lock is enabled, we need to ensure we have an active session
    return !SessionService.sessionActive;
  }
}

export default new VaultLockService();
