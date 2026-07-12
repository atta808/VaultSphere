import * as DocumentPicker from 'expo-document-picker';
import { SUPPORTED_MIME_TYPES } from '../../utils/mimeTypes';

export class DocumentImportService {
  static async pickDocuments(multiple = false) {
    const result = await DocumentPicker.getDocumentAsync({
      type: Object.keys(SUPPORTED_MIME_TYPES),
      copyToCacheDirectory: true,
      multiple: multiple,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map(asset => ({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size
    }));
  }
}
