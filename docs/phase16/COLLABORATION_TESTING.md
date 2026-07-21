# Collaboration Testing Strategy

## Coverage Areas
1. **Sharing Validation:** Test link generation, expiry, and unauthorized access handling.
2. **Offline Mode:** Generate comments offline, verify they store in SQLite, and verify sync queues successfully when brought back online.
3. **Workspace Isolation:** Ensure members of Workspace A cannot see/query documents exclusively in Workspace B.
4. **Version Restore Integrity:** Ensure restored files cleanly decrypt after swapping the file pointer to the previous version path.
5. **No Regressions:** Full test of primary Vault document import and rendering.
