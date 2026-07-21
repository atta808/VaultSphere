# Version History

## Philosophy
For Phase 16, VaultSphere maintains strict architectural simplicity and robustness by saving **complete encrypted documents** rather than binary deltas.

## Structure
Each record in the `version_history` table stores:
- A unique version UUID
- The original document ID
- An author/user timestamp
- The `encryptedFilePath` to the full encrypted backup of that version.

## Restoration
Restoring a file completely replaces the active document path with the older `encryptedFilePath`. All versions remain encrypted using Vault AES-256 conventions.
