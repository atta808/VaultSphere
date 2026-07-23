import { Logger } from '../../../utils/logger/Logger';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Credential Vault Service
 * Securely stores integration credentials using SecureStore with integrity hashing.
 */
class Service {
  async initialize() {
    Logger.info('Initializing CredentialVaultService...');
  }

  async storeCredentials(instanceId, credentials) {
    try {
      const serialized = JSON.stringify(credentials);

      // Generate SHA-256 integrity hash using expo-crypto
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        serialized
      );

      const payload = JSON.stringify({ data: serialized, hash });
      const secureKey = `integration_cred_${instanceId}`;

      await SecureStore.setItemAsync(secureKey, payload);

      Logger.info(`Stored credentials securely for ${instanceId}`);

      return secureKey;
    } catch (error) {
      Logger.error(`Failed to store credentials for ${instanceId}`, error);
      throw error;
    }
  }

  async getCredentials(instanceId) {
    try {
      const secureKey = `integration_cred_${instanceId}`;
      const payloadString = await SecureStore.getItemAsync(secureKey);

      if (!payloadString) return null;

      const payload = JSON.parse(payloadString);

      // Verify integrity
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payload.data
      );

      if (hash !== payload.hash) {
        throw new Error(`Integrity check failed for credentials: ${instanceId}`);
      }

      return JSON.parse(payload.data);
    } catch (error) {
      Logger.error(`Failed to retrieve credentials for ${instanceId}`, error);
      throw error;
    }
  }
}

export const CredentialVaultService = new Service();
