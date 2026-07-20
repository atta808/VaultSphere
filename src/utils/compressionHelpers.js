/**
 * Currently, Expo File System does not have native zip support without adding large native libraries
 * like react-native-zip-archive. To keep bundle size small and avoid native dependency issues,
 * our "compression" helpers will serve as an abstraction layer.
 *
 * For Phase 9, this uses an uncompressed folder approach as described in the requirements.
 * Future phases can implement real ZIP compression via a plugin or external service.
 */

export const compressBackup = async (sourcePath, _destinationPath) => {
  // Stub for future zip implementation.
  // Currently, the "backup package" is just a directory.
  // In a real zip implementation, we would zip `sourcePath` to `destinationPath`.
  return sourcePath;
};

export const decompressBackup = async (sourcePath, _destinationPath) => {
  // Stub for future unzip implementation.
  return sourcePath;
};
