import SecureStorageService, { SecureStorageKeys } from './SecureStorageService';

// Default auto-lock timeout is 5 minutes (300000ms)
export const AUTO_LOCK_OPTIONS = {
  IMMEDIATELY: 0,
  THIRTY_SECONDS: 30 * 1000,
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  NEVER: -1,
};

class SecuritySettingsService {
  async getAutoLockTimeout() {
    const val = await SecureStorageService.getItem(SecureStorageKeys.AUTO_LOCK_PREFERENCE);
    if (val === null) return AUTO_LOCK_OPTIONS.FIVE_MINUTES;
    return parseInt(val, 10);
  }

  async setAutoLockTimeout(timeoutMs) {
    await SecureStorageService.setItem(SecureStorageKeys.AUTO_LOCK_PREFERENCE, timeoutMs.toString());
  }

  async isAppLockEnabled() {
    const val = await SecureStorageService.getItem(SecureStorageKeys.APP_LOCK_PREFERENCE);
    return val === true;
  }

  async setAppLockEnabled(enabled) {
    await SecureStorageService.setItem(SecureStorageKeys.APP_LOCK_PREFERENCE, enabled);
  }

  async isVaultLockEnabled() {
    const val = await SecureStorageService.getItem(SecureStorageKeys.VAULT_LOCK_PREFERENCE);
    return val === true;
  }

  async setVaultLockEnabled(enabled) {
    await SecureStorageService.setItem(SecureStorageKeys.VAULT_LOCK_PREFERENCE, enabled);
  }

  async getSecurityStatus() {
     const appLock = await this.isAppLockEnabled();
     const vaultLock = await this.isVaultLockEnabled();
     const autoLock = await this.getAutoLockTimeout();

     if (appLock) return 'Maximum';
     if (vaultLock) return 'Protected';
     return 'Unprotected';
  }
}

export default new SecuritySettingsService();
