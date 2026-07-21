# Synchronization Architecture

## Offline-First Approach
The synchronization architecture operates with an offline-first mindset. The local SQLite database is the single source of truth. Updates hit SQLite first and are then queued for remote synchronization.

## Sync Queue
To orchestrate synchronization, the `SyncQueue` tracks create/update/delete operations against tracked entities. The queues persist locally ensuring that operations survive an application restart or crash. SQLite handles the state across background retries.

## Synchronization Granularity
The sync loop uses row/document-level delta synchronization. Changes prompt the uploading of the metadata delta, and any modified document files trigger a full encrypted upload of the new state (no block-level binary diffing).

## Conflict Resolution
Resolutions include Last Write Wins, Keep Local, Keep Cloud, or Duplicate Copy. Last Write Wins is heavily favored but conflicts manually flagged are captured in SQLite for UI surfacing.
