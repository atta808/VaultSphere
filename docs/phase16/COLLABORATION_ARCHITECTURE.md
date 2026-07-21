# Collaboration Architecture

## Core Concept
The collaboration logic follows a specific hierarchy:
`Vault -> Workspace -> Folders -> Documents -> Comments -> Versions -> Activities -> Audit Trail`.

A **Workspace** is the primary collaboration container, which is distinct from a mere Shared Folder. Workspaces hold shared resources, specific members, custom permissions, and isolated activity/audit feeds.

## Flow of Data (Offline-First)
1. **User Action:** User initiates an action (e.g., add comment).
2. **Service Layer:** `CollaborationService` handles business logic and invokes the repository.
3. **Repository Layer:** Entity created in local SQLite immediately for fast UI feedback.
4. **Queue for Cloud Sync:** Operation is queued via `CollaborationSyncService` (e.g., `ADD_COMMENT`).
5. **Sync Service:** Once online, queued metadata changes are securely synchronized. Document keys and data remain fully encrypted.

## Future Expandability
The architecture sets up tables (`collaborators`, `permissions`) and abstraction services intended to later accommodate:
- Live cursors/presence
- Digital signing
- Multi-team enterprise structures
