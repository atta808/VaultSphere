# Search Analytics

## Architecture
VaultSphere utilizes a hybrid analytics approach to maintain performance.

## Raw Events
Logged transparently to the extended `search_history` table (e.g., query, provider latency, cache hits).

## Pre-Aggregated Metrics
A background service (or sync event) aggregates the raw rows into the `search_analytics` table, generating daily/weekly statistics for dashboards (e.g., zero-result queries, average response times).
