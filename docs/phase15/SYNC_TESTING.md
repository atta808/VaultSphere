# Synchronization Testing

## Key Scenarios

1. **Offline Capability Validation**
   - Disconnect the network entirely and verify SQLite handles inserts natively without crashing or pausing the interface.
2. **Network Resilience**
   - Induce a simulated failure during sync uploads to ensure `retryCount` bumps correctly without queue data loss.
3. **Queue Rehydration**
   - Process multiple syncs, abruptly force-kill the app, and reopen to confirm previous unfinished items trigger on subsequent application start.
4. **Encryption Audit**
   - Ensure packets caught/extracted during transfer are securely ciphered via AES-256 containing no plain text.
5. **Conflict Matrix**
   - Manually insert older timestamps on mocked cloud payloads to guarantee "Last Write Wins" accurately favors the most recent local modifications.
