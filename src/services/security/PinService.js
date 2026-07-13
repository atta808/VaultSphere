import SecureStorageService, { SecureStorageKeys } from './SecureStorageService';
import { hashString } from '../../utils/securityHelpers';
import { validatePinFormat, MAX_RETRY_ATTEMPTS, LOCKOUT_DURATION_MS } from '../../utils/pinValidation';
import { PinError } from '../../utils/errors/SecurityErrors';

class PinService {
  constructor() {
    this.failedAttempts = 0;
    this.lockoutUntil = null;
  }

  async hasPinSetup() {
    const pinHash = await SecureStorageService.getItem(SecureStorageKeys.PIN_HASH);
    return !!pinHash;
  }

  async createPin(pin) {
    if (!validatePinFormat(pin)) {
      throw new PinError('Invalid PIN format. Must be 4-8 digits.');
    }

    const hashedPin = await hashString(pin);
    if (!hashedPin) throw new PinError('Failed to hash PIN.');

    await SecureStorageService.setItem(SecureStorageKeys.PIN_HASH, hashedPin);
    return true;
  }

  async removePin() {
    await SecureStorageService.removeItem(SecureStorageKeys.PIN_HASH);
    return true;
  }

  async changePin(oldPin, newPin) {
    const isValid = await this.verifyPin(oldPin);
    if (!isValid) {
      throw new PinError('Old PIN is incorrect.');
    }

    if (!validatePinFormat(newPin)) {
      throw new PinError('Invalid new PIN format. Must be 4-8 digits.');
    }

    const hashedNewPin = await hashString(newPin);
    await SecureStorageService.setItem(SecureStorageKeys.PIN_HASH, hashedNewPin);
    return true;
  }

  async verifyPin(pin) {
    if (this.isLockedOut()) {
      throw new PinError(`Too many attempts. Try again later.`);
    }

    if (!pin) return false;

    const storedHash = await SecureStorageService.getItem(SecureStorageKeys.PIN_HASH);
    if (!storedHash) {
      throw new PinError('No PIN configured.');
    }

    const inputHash = await hashString(pin);

    if (storedHash === inputHash) {
      this.resetAttempts();
      return true;
    } else {
      this.handleFailedAttempt();
      return false;
    }
  }

  handleFailedAttempt() {
    this.failedAttempts += 1;
    if (this.failedAttempts >= MAX_RETRY_ATTEMPTS) {
      this.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      throw new PinError('Maximum attempts reached. Locked out temporarily.');
    }
  }

  resetAttempts() {
    this.failedAttempts = 0;
    this.lockoutUntil = null;
  }

  isLockedOut() {
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      return true;
    } else if (this.lockoutUntil && Date.now() >= this.lockoutUntil) {
      this.resetAttempts(); // Auto-reset when duration expires
      return false;
    }
    return false;
  }

  getRemainingLockoutTime() {
     if (this.isLockedOut()) {
         return Math.max(0, this.lockoutUntil - Date.now());
     }
     return 0;
  }
}

export default new PinService();
