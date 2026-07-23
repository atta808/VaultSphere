# Import and Export Pipelines

## Architecture
The `ImportExportService` standardizes ingestion and extraction using the `expo-file-system`.

## Temporary Files
- Files are staged into `FileSystem.cacheDirectory` or similar temporary locations.
- **Cleanup:** Temporary files must ALWAYS be cleaned up upon process completion (success or fail) to prevent device storage bloat.

## Incremental Processing
For large datasets, the engine processes chunks to avoid memory starvation on mobile clients. Status is updated in the `import_jobs` or `export_jobs` tables to report progress to the UI.
