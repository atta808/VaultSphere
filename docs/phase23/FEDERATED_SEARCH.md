# Federated Search

## Overview
The Federated Search architecture allows a single user query to span multiple disparate knowledge bases while preserving strict local caching and offline-first boundaries.

## Workflow
1. The `FederatedSearchService` receives a query from the `EnterpriseSearch` screen.
2. It delegates execution to the `QueryPlannerService`.
3. Results are aggregated, normalized, permission-checked, and finally ranked.
4. Analytics are logged post-execution.
