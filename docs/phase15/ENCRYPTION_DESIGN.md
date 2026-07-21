# Encryption Design

## Encryption Methodology
Vault backups and related files are encrypted using **AES-256** standard (via `crypto-js`) ensuring no plaintext documents are uploaded to cloud endpoints.

## Key Management
The device securely generates a 256-bit vault encryption key managed locally via `expo-secure-store`. Crucially, these keys are never uploaded. Users can perform restore operations requiring authentication validity beforehand.
