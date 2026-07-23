# Query Planner Service

## Role
The Query Planner orchestrates multi-provider search requests.

## Execution Model
- **Parallel Fetching:** `Promise.all()` maps across all registered, active providers. If one provider fails (e.g., external API timeout), it catches the exception and returns an empty array, allowing other providers to succeed gracefully.
- **Normalization:** Raw objects are routed through `ResultNormalizationService` to guarantee predictable rendering in the UI.
- **Security Check:** Validates the user's permission graph prior to displaying results.
