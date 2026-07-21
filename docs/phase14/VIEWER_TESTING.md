# Viewer Testing Plan

## Verified Core Features
- [x] PDF viewing
- [x] Image viewing
- [x] Zoom and Pan Gestures
- [x] Search Bar mounting/unmounting
- [x] Bookmark creation/retrieval
- [x] Advanced Annotation models
- [x] Reading progress persistence

## Tests Expected
- Check for regression in `vaultsphere.db` during migrations. Ensure older documents preserve schema.
- Validate `DeviceEventEmitter` correctly catches `VAULT_LOCKED` and destroys temporary files securely.
- Ensure `sessionDuration` safely accumulates metrics without resetting on re-entry.
- Monitor `AnnotationOverlay` rendering on various device aspect ratios to confirm relative bounds scaling logic.
