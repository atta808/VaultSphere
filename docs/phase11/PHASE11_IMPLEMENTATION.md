# Phase 11: Advanced Search & Smart Organization Engine

## Overview
This phase introduces a robust, scalable, and fully local search engine for VaultSphere, using SQLite's FTS5 virtual tables. It includes debounced searching, relevance-based text matching, recent search history, tagging capabilities, and smart collections derived dynamically from the `documents` table and related metadata.

## Implementation Details

### Database Migrations
- Added `003_search_history_schema.js` which includes the `search_history` table for tracking recent searches.
- Introduced `search_index_fts`, an FTS5 virtual table for lightning-fast and relevance-ranked searches. Columns include `filename`, `ocr`, `ai_keywords`, `ai_entities`, `ai_summary`, `tags`, `notes`, and `metadata`.

### Repositories
- `SearchHistoryRepository`: Handles tracking recent queries, pinning, and clearing unused search history.
- `SearchIndexRepository`: Modified to use the `search_index_fts` virtual table. FTS5 indexing supports document syncing on insert/update/delete.
- `TagRepository`: Expanded methods to lookup tags by document and assign/remove document tags.

### Services
1. `SearchIndexService`: Rebuilds search vectors by aggregating OCR, AI summary/keywords/entities, and tags for a specific document into the FTS engine.
2. `SearchService`: Rewritten to use `bm25` relevance rankings with weighting priorities. (e.g. Exact/Prefix matches in Filename rank highest, OCR text, then AI data, then tags).
3. `SearchHistoryService`: Acts as a mediator for pinning, fetching, adding, and clearing searches.
4. `RecentDocumentsService`: Uses deterministic queries against `createdAt` and `updatedAt` to fetch recent additions dynamically.
5. `SmartCollectionService`: Creates real-time views of structured documents, such as "Favorites," "OCR Completed," "Large Files," and "AI Processed."
6. `TagService`: Centralized management of assigning, creating, coloring, and deleting tags.
7. `FilterService`: Generates SQL query filters to run dynamically on top of standard table searches.

### UI Enhancements
- Created `useDebouncedSearch` hook to reduce database query spam.
- Developed `HighlightedText` utility to apply visual matching logic for exact word highlighting.
- Overhauled `SearchScreen.js` for an optimized, grouped result viewing experience, showcasing Recent Searches, Smart Collections, and highlight-supported search responses.

## Core Rules Adhered
- Kept SQLite specific queries isolated in repositories and services.
- Search history is managed in `SQLite`, not `AsyncStorage`.
- Smart collections rely on dynamic lookups, preventing data replication.
- Implemented `React Native Paper` conforming UI.
