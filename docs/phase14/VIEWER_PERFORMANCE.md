# Performance Strategy

## Heavy PDF Loading
- Utilizing `react-native-pdf` for robust native-level memory management and caching.
- Sidebars (like Thumbnails or Bookmarks) are deferred until explicitly opened to prevent front-loaded rendering lag.

## Image Renderings
- Reanimated handles gesture updates natively, bypassing the React JS thread completely during pan/zoom on images.

## Annotation Rendering
- Overlays only mount when annotations exist.
- Using `pointerEvents="box-none"` to ensure touches fall through correctly when annotations are sparse.
- Future ready for `react-native-skia` migration for 60fps massive vector renderings.
