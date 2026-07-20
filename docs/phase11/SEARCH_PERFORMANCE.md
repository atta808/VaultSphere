# Search Performance Guidelines

Because VaultSphere aims to accommodate 10,000+ local documents across an end-user device, strict performance rules have been integrated:

1. **Virtual Tables (FTS5)**: `LIKE` percentage queries severely cripple SQLite performance when evaluating large textual blocks (like 5-page OCR text). `FTS5` uses internal tokenization mapping to bypass linear searches.
2. **Debouncing**: Search inputs never fire linearly on every keystroke, reducing continuous context switching and blocking UI renders.
3. **No Redundant Tables**: Smart collections execute simple `JOIN` filtering against static relationship tables (e.g. `favorites`), which operate instantly via basic indexing (`idx_favorites_documentId`). We do not replicate collections to physical tables.
4. **UNINDEXED ID Mapping**: We mark `documentId UNINDEXED` on the FTS table, meaning tokenization doesn't map numerical tracking IDs. This keeps the inverted index smaller.

To maintain performance, any future additions to `search_index_fts` must consider tokenization impact.
