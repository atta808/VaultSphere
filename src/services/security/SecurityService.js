import AuthenticationService from './AuthenticationService';
import BiometricService from './BiometricService';
import PinService from './PinService';
import SecureStorageService from './SecureStorageService';
import SecuritySettingsService from './SecuritySettingsService';
import SessionService from './SessionService';
import VaultLockService from './VaultLockService';
import EncryptionService from './EncryptionService';

// The centralized Security Engine Facade
class SecurityService {
  constructor() {
    this.auth = AuthenticationService;
    this.biometrics = BiometricService;
    this.pin = PinService;
    this.storage = SecureStorageService;
    this.settings = SecuritySettingsService;
    this.session = SessionService;
    this.vaultLock = VaultLockService;
    this.encryption = EncryptionService;
  }
}

export default new SecurityService();
