# Search Architecture

VaultSphere's Advanced Search relies on a fully synchronized, local-first search model driven by `SQLite FTS5`.

## High-Level Flow
1. **Document Lifecycle Event**: A document is imported, deleted, or updated (via name change, OCR parse, AI classification, or tag modification).
2. **Indexing Trigger**: The application calls `SearchIndexService.indexDocument(documentId)`.
3. **Data Aggregation**: The service queries `OCRResultRepository`, `DocumentKeywordRepository`, `DocumentSummaryRepository`, `TagRepository`, etc.
4. **Vector Synchronization**: A single row containing merged spatial data (filenames, aggregated text, tags, metadata) is `UPSERTED` into the `search_index_fts` virtual table.
5. **Client Query**: The user types "Contract" into the `SearchScreen`.
6. **Debouncing**: `useDebouncedSearch` waits 300ms before execution.
7. **Execution**: `SearchService.search()` performs an FTS5 `MATCH` query with prefix wildcarding (`"Contract"*`).
8. **Ranking**: Results are sorted via `bm25` (ranking exact filename matches over OCR text).
9. **UI Rendering**: `HighlightedText` dynamically overlays the matching keyword on the returned result.

## Future Proofing
The architecture expects future expansion. AI Search and Semantic Search can be built into additional vector stores, running alongside or post-ranking FTS5 lookups, leaving the base robust.
