# Viewer Architecture

## Core Concept
The viewer architecture adheres to Clean Architecture principles, ensuring that the UI remains separate from the rendering engine and business logic. `DocumentViewerScreen` acts as the orchestrator for the visual components but relies on `DocumentViewerService` to manage the state and logic.

## Components
### Services
- **`DocumentViewerService`:** Orchestrates the rendering and state of the active document.
- **`AnnotationService` / `BookmarkService`:** Manages CRUD operations for annotations and bookmarks.
- **`RecentPositionService`:** Persists and restores the scroll/page position for documents.
- **`ThumbnailService`:** Handles async generation and caching of document thumbnails.
- **`ViewerPreferenceService`:** Manages user-level reading preferences.

### Renderers
Renderers are stateless visual components that know how to display specific file types:
- **`PDFRenderer`:** Handles application/pdf.
- **`ImageRenderer`:** Handles images (jpeg, png, webp).
- **`TextRenderer`:** Handles plain text.

### Flow
1. User opens a document from `DocumentDetailsScreen`.
2. Navigation passes the Document ID to `DocumentViewerScreen`.
3. `DocumentViewerScreen` uses `DocumentViewerService` to determine the correct renderer.
4. The Renderer displays the document, dispatching events back up (e.g., page changed, zoom level changed).
5. Secondary panels (Thumbnails, Annotations) read data from the associated services to provide extra functionality.
