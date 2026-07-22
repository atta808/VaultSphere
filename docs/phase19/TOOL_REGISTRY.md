# Tool Registry

The Tool Registry is an abstraction layer that permits agents to interact with the VaultSphere system securely.

## Registration
Each tool defines:
- `name`
- `description`
- `inputSchema` (JSON schema)
- `outputSchema`
- `permissionRequirements`
- `requiresApproval` (boolean)
- `handler` (Async execution function)

## Built-in Tools
- `OCR_TOOL`
- `SEARCH_TOOL`
- `DELETE_DOCUMENT_TOOL` (Requires Approval)
- `NOTIFICATION_TOOL`
