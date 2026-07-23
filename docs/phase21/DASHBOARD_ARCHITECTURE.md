# Dashboard Architecture

Dashboards in VaultSphere are purely dynamic. Configurations reside in the `dashboard_configs` table and are built via the `DashboardService`.
Widgets are bound to standard identifiers (like `docs_total`) and map locally via `DataAggregationService` which parses standard snapshots rather than hitting live queries constantly.
