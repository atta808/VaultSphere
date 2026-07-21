# Performance Report

## Memory Management
The viewer carefully manages memory by:
- Lazily loading pages (specifically for PDFs and large lists).
- Ensuring services cleanly unmount and clear their state when the viewer screen is closed.
- Performing thumbnail generation asynchronously so it does not block the main JS thread.

## Rendering
- **Images:** Uses standard Expo Image which natively handles efficient decoding.
- **PDFs:** Architecture is designed to abstract the PDF renderer so that an optimized native module can be swapped in if necessary.
- **State Updates:** React Native Reanimated or native gesture handlers are leveraged where possible to keep zooming and panning at 60fps without triggering React renders for every frame.
