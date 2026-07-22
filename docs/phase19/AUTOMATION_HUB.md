# Automation Hub

Provides event-driven automation for the VaultSphere platform.

## Architecture
`AutomationHubService` registers listeners on `DeviceEventEmitter` for core domain events:
- `DOCUMENT_IMPORTED`
- `OCR_COMPLETED`
- `AI_SUMMARY_CREATED`
- `EMBEDDINGS_GENERATED`

When triggered, it checks active jobs in `AutomationJobRepository`, evaluates conditions, and runs actions via the execution services.
