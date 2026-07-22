# Semantic Search Architecture

- Embeddings are generated using the \`EmbeddingProvider\` (Cloud API defaults to Gemini).
- Computed vectors are saved locally alongside chunks in \`semantic_index\`.
- \`SimilarityEngine.js\` runs cosine similarity locally against stored embeddings.
- \`SemanticSearchService.js\` implements a Hybrid Search using Reciprocal Rank Fusion (RRF) to merge keyword results and semantic scores.
