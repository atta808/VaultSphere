# Search Provider Registry

## Architecture
The registry dynamically loads Search Providers. Each provider extends the `BaseSearchProvider` class, enforcing an explicit contract.

## Internal Providers
- `LocalVaultSearchProvider`
- `SemanticSearchProvider`
- `KnowledgeGraphSearchProvider`

## External Providers
External integrations interact via this registry using mocked stubs (e.g., `MockExternalSearchProvider`), preparing the platform to plug into Microsoft Graph or Google Cloud Search in subsequent iterations.
