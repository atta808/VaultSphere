import * as ImagePicker from 'expo-image-picker';

export class ImageImportService {
  static async pickImages(multiple = false) {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
       throw new Error('Permission to access media library was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiple,
      quality: 1, // Keep original quality
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map(asset => {
      // Determine a safe name and mimeType
      const name = asset.fileName || asset.uri.split('/').pop() || `image_${Date.now()}.jpg`;
      let mimeType = asset.mimeType;

      if (!mimeType) {
         if (name.toLowerCase().endsWith('.png')) mimeType = 'image/png';
         else if (name.toLowerCase().endsWith('.webp')) mimeType = 'image/webp';
         else mimeType = 'image/jpeg';
      }

      return {
        uri: asset.uri,
        name: name,
        mimeType: mimeType,
        size: asset.fileSize || 0
      };
    });
  }
}
