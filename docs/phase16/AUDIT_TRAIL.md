# Audit Trail

## Overview
The `audit_trail` table is designed strictly for compliance and security auditing, completely separate from the `activities` table which powers user UI feeds.

## Characteristics
- **Immutable:** Audit logs are never updated or deleted by normal users (handled structurally by the repository without `deletedAt`).
- **Data Logged:** Timestamps, UUIDs, explicit action names (e.g., `DOCUMENT_SHARED`, `PERMISSION_GRANTED`), device ID, and user ID.
- **Coverage:** Required for all sharing links, permission changes, versions, and workspace creation.
