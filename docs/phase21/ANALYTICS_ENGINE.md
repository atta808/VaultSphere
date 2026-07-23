# Analytics Engine

The Analytics Engine manages offline-first tracking of business events.
Events like "Document Created", "Legal Hold Applied", and "Agent Executed" are recorded in `analytics_events`.
The `MetricsEngine` processes these periodically to produce `analytics_snapshots`.
