# Reporting Engine

Reports are metadata driven. Definitions (filters, selected KPIs, time ranges) reside in `report_templates`. Generated payloads run via `ReportingService` and persist raw JSON payload data in `reports` for eventual PDF/Excel export.
