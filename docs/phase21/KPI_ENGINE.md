# KPI Engine

KPIs define target metrics (e.g., Compliance %).
They are calculated by the `KPIService` which evaluates historical data, stores point-in-time entries in `kpi_history`, and maintains the current state in the `kpis` table.
