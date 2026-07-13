import { AppState } from 'react-native';
import SecuritySettingsService from './SecuritySettingsService';
import SecureStorageService, { SecureStorageKeys } from './SecureStorageService';
import { generateToken } from '../../utils/securityHelpers';

class SessionService {
  constructor() {
    this.appState = AppState.currentState;
    this.backgroundTimestamp = null;
    this.sessionActive = false;
    this.lockCallback = null;
    this.appStateSubscription = null;
  }

  async startSession() {
    const token = generateToken();
    await SecureStorageService.setItem(SecureStorageKeys.SESSION_TOKEN, token);
    this.sessionActive = true;
    this.backgroundTimestamp = null;
  }

  async endSession() {
    await SecureStorageService.removeItem(SecureStorageKeys.SESSION_TOKEN);
    this.sessionActive = false;
    if (this.lockCallback) {
        this.lockCallback();
    }
  }

  initialize(onRequireLock) {
    this.lockCallback = onRequireLock;

    // Prevent duplicate listeners
    if (this.appStateSubscription) {
        this.appStateSubscription.remove();
    }

    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
  }

  cleanup() {
     if (this.appStateSubscription) {
         this.appStateSubscription.remove();
         this.appStateSubscription = null;
     }
  }

  handleAppStateChange = async (nextAppState) => {
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      await this.checkTimeout();
    } else if (this.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App has gone to the background
      this.backgroundTimestamp = Date.now();
    }

    this.appState = nextAppState;
  };

  async checkTimeout() {
    if (!this.backgroundTimestamp || !this.sessionActive) return;

    const autoLockTimeout = await SecuritySettingsService.getAutoLockTimeout();

    if (autoLockTimeout === -1) {
        // Never lock
        this.backgroundTimestamp = null;
        return;
    }

    const timeInBackground = Date.now() - this.backgroundTimestamp;

    if (timeInBackground >= autoLockTimeout) {
      await this.endSession();
    }

    this.backgroundTimestamp = null;
  }
}

export default new SessionService();
