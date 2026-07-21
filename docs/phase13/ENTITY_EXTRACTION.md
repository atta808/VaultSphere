# Entity Extraction

Implemented as a background hook inside `DocumentIntelligenceService`.
Fires immediately after primary OCR analysis and extracts: Names, Dates, Entities into `ai_entities` table, mapped to `documentId`.
These entities are indexed into FTS.
