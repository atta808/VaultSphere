# Connector Architecture

## Overview
Connectors translate external APIs into standard VaultSphere services. All connectors extend the `BaseConnector` interface and are registered in `ConnectorRegistry`.

## Interface Requirements
A standard connector must implement:
- `getMetadata()`: ID, name, version, supported capabilities.
- `authenticate(credentials)`: Validates connection logic.
- `checkHealth()`: Checks active latency and status.
- `importData(config)`: Ingest external information.
- `exportData(config)`: Egress internal data.
- `synchronize(state)`: Incremental sync handler based on prior state.

## Synchronization Rules
Connectors **never** interact directly with SQLite.
The pipeline is strictly:
`ConnectorManagerService` -> `ConnectorSyncService` -> `CloudSyncService` -> `SQLite (via existing Repo)`
