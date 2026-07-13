/**
 * Centralized AI Configuration Layer
 * Loads provider configuration from environment variables or Expo Secure Store.
 * Does not expose secrets to UI.
 */

// import * as SecureStore from 'expo-secure-store';

class AIConfig {
  constructor() {
    this.config = {
      providers: {
        googleVision: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || null,
        },
        gemini: {
          apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || null,
        }
      }
    };
  }

  // Future-proofing: load from secure store async if needed
  async initialize() {
    /*
    const storedVisionKey = await SecureStore.getItemAsync('GOOGLE_VISION_API_KEY');
    if (storedVisionKey) {
      this.config.providers.googleVision.apiKey = storedVisionKey;
    }

    const storedGeminiKey = await SecureStore.getItemAsync('GEMINI_API_KEY');
    if (storedGeminiKey) {
      this.config.providers.gemini.apiKey = storedGeminiKey;
    }
    */
  }

  getProviderConfig(providerId) {
    const provider = this.config.providers[providerId];
    if (!provider) {
      throw new Error(`Configuration for provider '${providerId}' not found.`);
    }
    return provider;
  }

  getGoogleVisionApiKey() {
    return this.config.providers.googleVision.apiKey;
  }

  getGeminiApiKey() {
    return this.config.providers.gemini.apiKey;
  }
}

export default new AIConfig();
