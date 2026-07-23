# Phase 23 Testing Strategy

## Areas of Verification

### 1. Database Migrations
- [x] Verify `014_phase23_federated_search.js` safely extends `search_history` columns without truncating past rows.
- [x] Verify index schemas properly generate constraints (`UNIQUE(providerId, externalId)`).

### 2. Search Provider Framework
- [x] Ensure providers instantiate correctly via Lazy Loading inside `SearchProviderRegistry` to prevent boot circular dependencies.
- [x] Validate that failure in one provider (e.g., `MockExternalSearchProvider`) does not crash the `QueryPlannerService.planAndExecute` Promise chain.

### 3. Ranking Engine
- [x] Confirm keyword freshness weighting logic successfully sorts mocked results.

### 4. UI Layer
- [x] Open the `EnterpriseDashboard` and tap the "Open Search Portal" link.
- [x] Alternatively, open the `HomeScreen` and verify the "Enterprise Search" Quick Action correctly navigates to the portal.
- [x] Verify entering text and searching aggregates results across Local, Semantic, and Mock External providers.

### 5. Architectural Compliance
- [x] Validate no full-text content of external documents is indexed locally; only short snippets.
- [x] Confirm no React Component imports SQLite files or repositories directly.
