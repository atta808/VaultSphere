# Credential Vault

## Security Overview
VaultSphere does not store API credentials, tokens, or webhook secrets in plaintext within SQLite.

## Implementation Details
- Uses `expo-secure-store` for native OS-level secure keystore access.
- Uses `expo-crypto` to generate a SHA-256 integrity hash of the data before it is stored.
- At retrieval, the payload is verified against the stored hash to detect tampering before usage.

## Support for Hardware Backing
The `CredentialVaultService` abstraction is designed such that future iterations can pivot toward enterprise secret managers if VaultSphere is deployed in a hybrid context.
