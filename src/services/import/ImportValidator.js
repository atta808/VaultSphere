import * as FileSystem from 'expo-file-system';
import { isExtensionSupported, getExtensionFromFileName } from '../../utils/fileExtensions';
import { isMimeTypeSupported } from '../../utils/mimeTypes';
import { InvalidFileError, UnsupportedFileError } from '../../utils/errors/customErrors';

export class ImportValidator {
  static async validateFile(fileUri, fileName, mimeType, size) {
    if (!fileUri) {
      throw new InvalidFileError('File URI is required for validation.');
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new InvalidFileError('File does not exist at the specified path.');
      }
    } catch (error) {
      throw new InvalidFileError(`Could not verify file existence: ${error.message}`);
    }

    const extension = getExtensionFromFileName(fileName);
    if (!extension || !isExtensionSupported(extension)) {
      throw new UnsupportedFileError(`File extension '${extension}' is not supported.`);
    }

    if (mimeType && !isMimeTypeSupported(mimeType)) {
      throw new UnsupportedFileError(`MIME type '${mimeType}' is not supported.`);
    }

    // Example max size validation, say 500MB (500 * 1024 * 1024)
    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (size && size > MAX_FILE_SIZE) {
      throw new InvalidFileError(`File size exceeds the maximum limit of 500MB.`);
    }

    return true;
  }
}
