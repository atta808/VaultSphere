# Annotation Engine

## Structure
Annotations in VaultSphere are mapped to precise locations on documents.

## Schema
- **`id`:** UUID
- **`documentId`:** Foreign key to the document.
- **`pageNumber`:** Specific page (e.g., for PDF).
- **`x`, `y`:** Relative or absolute coordinates on the page.
- **`width`, `height`:** Size of the annotation area.
- **`type`:** Type of annotation (`highlight`, `note`, `drawing`).
- **`content`:** The text content (if applicable).
- **`color`:** The visual color of the highlight/note.
- **`createdAt`, `updatedAt`:** Timestamps.

## Drawing Placeholder
The database schema and service interface support a `drawing` type, which is intended for future ink annotations. The UI includes a disabled button for drawing labeled "Coming Soon" to signify future readiness.
