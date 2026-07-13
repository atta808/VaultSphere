import * as Crypto from 'expo-crypto';

// Basic helpers for hashing and security-related crypto operations

export const hashString = async (inputString) => {
  if (!inputString) return null;
  // Use SHA-256 for hashing PINs and standard inputs
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    inputString
  );
  return hash;
};

// Generates a random UUID (can be used for session tokens, encryption keys, etc.)
export const generateToken = () => {
  return Crypto.randomUUID();
};
