import * as LocalAuthentication from 'expo-local-authentication';
import SecureStorageService, { SecureStorageKeys } from './SecureStorageService';
import { BiometricError } from '../../utils/errors/SecurityErrors';

class BiometricService {
  constructor() {
    this.hardwareCapabilities = null;
    this.isEnrolledCache = null;
  }

  async checkHardwareAvailability() {
    if (this.hardwareCapabilities !== null) {
      return this.hardwareCapabilities;
    }
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      this.hardwareCapabilities = hasHardware;
      return hasHardware;
    } catch (error) {
      throw new BiometricError('Failed to check hardware capabilities.');
    }
  }

  async checkEnrollment() {
    // We intentionally don't aggressively cache enrollment, as user could add/remove fingerprints while app is running
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      this.isEnrolledCache = isEnrolled;
      return isEnrolled;
    } catch (error) {
      throw new BiometricError('Failed to check biometric enrollment.');
    }
  }

  async isBiometricEnabledByUser() {
      const isEnabled = await SecureStorageService.getItem(SecureStorageKeys.BIOMETRIC_PREFERENCE);
      return isEnabled === true;
  }

  async setBiometricPreference(enabled) {
      await SecureStorageService.setItem(SecureStorageKeys.BIOMETRIC_PREFERENCE, enabled);
  }

  async canAuthenticate() {
    const hasHardware = await this.checkHardwareAvailability();
    const isEnrolled = await this.checkEnrollment();
    return hasHardware && isEnrolled;
  }

  async authenticate(promptMessage = 'Authenticate to access VaultSphere') {
    const canAuth = await this.canAuthenticate();
    if (!canAuth) {
      throw new BiometricError('Biometrics not available or not enrolled.');
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return true;
      } else if (result.error === 'user_cancel' || result.error === 'system_cancel') {
        // Graceful cancellation, not an error
        return false;
      } else if (result.error === 'fallback') {
        // User explicitly chose to use fallback (PIN)
        return false;
      }

      throw new BiometricError(`Biometric authentication failed: ${result.error}`);
    } catch (error) {
       if (error instanceof BiometricError) throw error;
       throw new BiometricError(`Biometric authentication error: ${error.message}`);
    }
  }
}

export default new BiometricService();
