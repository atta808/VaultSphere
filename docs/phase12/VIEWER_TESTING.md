# Viewer Testing Strategy

## Overview
Phase 12 introduces complex interactions (gestures, background tasks, native rendering) which must be thoroughly verified to prevent regressions.

## Key Areas to Test
1. **Large Files:** Load large PDFs (> 50MB) and large high-resolution images to verify responsiveness and memory consumption.
2. **Resumption:** Open a document, scroll/zoom to a specific page, close it, and reopen it. Ensure it resumes exactly where left off.
3. **Annotation Persistence:** Create a highlight and a note. Verify they appear on the correct page and coordinates after reloading.
4. **Thumbnails:** Add a new document and verify the thumbnail is generated in the background without freezing the UI.
5. **Memory Leaks:** Open and close multiple documents rapidly. Monitor memory usage to ensure resources are released.
6. **Transparent Images:** Load a PNG with a transparent background and ensure the checkerboard pattern (adapted to the current theme) is visible behind it.
