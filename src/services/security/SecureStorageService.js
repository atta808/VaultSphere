import * as SecureStore from 'expo-secure-store';
import { SecureStorageError } from '../../utils/errors/SecurityErrors';

// Never log Secure Store values
export const SecureStorageKeys = {
  PIN_HASH: 'vaultsphere.pin.hash',
  BIOMETRIC_PREFERENCE: 'vaultsphere.biometric.enabled',
  AUTO_LOCK_PREFERENCE: 'vaultsphere.autolock.preference',
  APP_LOCK_PREFERENCE: 'vaultsphere.applock.enabled',
  VAULT_LOCK_PREFERENCE: 'vaultsphere.vaultlock.enabled',
  SESSION_TOKEN: 'vaultsphere.session.token',
};

class SecureStorageService {
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await SecureStore.setItemAsync(key, stringValue);
    } catch (error) {
      throw new SecureStorageError(`Failed to save item to secure storage: ${error.message}`);
    }
  }

  async getItem(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      throw new SecureStorageError(`Failed to read item from secure storage: ${error.message}`);
    }
  }

  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      throw new SecureStorageError(`Failed to delete item from secure storage: ${error.message}`);
    }
  }

  async clearAllSecurityKeys() {
    try {
      const promises = Object.values(SecureStorageKeys).map((key) =>
        this.removeItem(key)
      );
      await Promise.all(promises);
    } catch (error) {
      throw new SecureStorageError(`Failed to clear security keys: ${error.message}`);
    }
  }
}

export default new SecureStorageService();
