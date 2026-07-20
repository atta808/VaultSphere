import PinService from './PinService';
import { Logger } from '../../utils/logger/Logger';
import BiometricService from './BiometricService';
import { AuthenticationError } from '../../utils/errors/SecurityErrors';

class AuthenticationService {
  async authenticateWithPin(pin) {
    try {
      const isValid = await PinService.verifyPin(pin);
      if (!isValid) {
        throw new AuthenticationError('Invalid PIN.');
      }
      return true;
    } catch (error) {
       throw error; // Re-throw PinError (which extends SecurityError) to be handled by UI
    }
  }

  async authenticateWithBiometrics(promptMessage) {
    try {
       const isEnabled = await BiometricService.isBiometricEnabledByUser();
       if (!isEnabled) {
           return false; // Not enabled, fallback immediately to PIN UI
       }

       const success = await BiometricService.authenticate(promptMessage);
       return success;
    } catch (error) {
       // Log internally if needed, but return false to trigger PIN fallback gracefully
       // unless it's a critical error. For now, graceful fallback.
       Logger.warn('Biometric auth error/fallback:', error.message);
       return false;
    }
  }

  async hasAuthenticationSetup() {
     return await PinService.hasPinSetup();
  }
}

export default new AuthenticationService();
