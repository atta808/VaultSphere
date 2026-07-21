# Annotation Engine

## Data Model
Each annotation is tracked securely in the `document_annotations` table with properties like:
- `id` (UUID)
- `documentId`
- `pageNumber`
- `type` (highlight, rectangle, circle, freehand, note, strike-through, underline)
- Spatial coordinates: `x`, `y`, `width`, `height`
- `content` (Text for notes, SVG Path for freehand)
- `color` (Stroke/Fill representation)
- `author` & `metadata` (Prepared for collaboration/cloud synchronization)

## Rendering Strategy
Annotations are resolved per page.
- In `PDFRenderer`, `pageAnnotations` are filtered and passed down to `AnnotationOverlay`.
- `react-native-svg` maps the normalized/absolute coordinates into standard SVG elements (`<Rect>`, `<Path>`, `<Circle>`).

## Interactions
- **Selection**: Tapping an annotation bubbles an event upward.
- **Creation**: Triggered via `AnnotationToolbar`. Uses default widths/paths which can later be updated by touch events.
