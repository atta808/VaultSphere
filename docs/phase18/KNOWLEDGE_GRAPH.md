# Knowledge Graph Architecture

The Knowledge Graph connects Documents, Entities, and AI Topics using standard SQLite tables \`knowledge_nodes\` and \`knowledge_edges\`.

- Preserves offline capabilities
- Keeps query latency low by maintaining a 1-depth lookahead initially.
- Prepares for future D3.js or other advanced visualization plugins.
