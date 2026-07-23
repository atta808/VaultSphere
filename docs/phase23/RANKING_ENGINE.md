# Ranking Engine

## Role
Normalizes disparate scoring models into a single weighted score list.

## Current Weights
- **Keyword Relevance:** High baseline score for exact title matches.
- **Freshness:** Decay function favoring recently modified documents (e.g., < 7 days old).

## Future Expansion
The Engine is designed to easily ingest metadata from AI confidence models, graph traversals, and usage analytics to dynamically adjust ranks over time.
