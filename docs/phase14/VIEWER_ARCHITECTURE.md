# Document Viewer Architecture

## Core Principles
1. **Renderer Agnostic**: The viewer wrapper orchestrates the panels (Thumbnails, Bookmarks, Annotations), while passing rendering responsibilities to specific renderer components (`PDFRenderer`, `ImageRenderer`, `TextRenderer`).
2. **Layered Annotations**: Annotations are never burned into the original file by default. `react-native-svg` overlays render the visual annotations by synchronizing with the parent layout constraints.
3. **Lazy Execution**: Annotations, thumbnails, and side-panels load asynchronously or incrementally to guarantee an unblocked UI thread.

## Component Flow
- `DocumentViewerScreen`: Main coordinator. Fetches `documentId`, verifies permissions, prepares the file, fetches preferences/annotations/history.
- `PDFRenderer` / `ImageRenderer`: Manages the viewport, handles gestures (pan, pinch-to-zoom). Notifies `DocumentViewerScreen` of dimension and page changes.
- `AnnotationOverlay`: Renders inside the Renderer components, ensuring exact bounding boxes relative to the displayed document image.

## AI Integration
- `ViewerAIToolbar`: Globally triggers actions like "Summarize Page".
- `TextSelectionContextMenu`: Triggered when text is selected inside a renderer. Provides targeted actions like "Translate" or "Extract Entities".
