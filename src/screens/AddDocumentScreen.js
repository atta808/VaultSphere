import React from 'react';

import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereActionCard } from '../components/cards/SphereActionCard';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import VaultService from '../services/vault/VaultService';
import { useNavigation } from '@react-navigation/native';

export default function AddDocumentScreen() {
  const navigation = useNavigation();

  const handleImportPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await VaultService.importDocument(file.uri, file.name, file.mimeType, file.size);
        Alert.alert('Success', 'PDF imported successfully');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', `Failed to import PDF: ${error.message}`);
    }
  };

  const handleImportImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileName = file.fileName || file.uri.split('/').pop() || 'image.jpg';
        await VaultService.importDocument(file.uri, fileName, file.mimeType || 'image/jpeg', file.fileSize || 0);
        Alert.alert('Success', 'Image imported successfully');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', `Failed to import Image: ${error.message}`);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await VaultService.createFolder(`New Folder ${Date.now()}`);
      Alert.alert('Success', 'Folder created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to create folder: ${error.message}`);
    }
  };

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader
        title="Add to Vault"
        subtitle="Choose how you want to add a new document."
      />

      <SphereSectionCard>
        <SphereActionCard
          title="Scan Document"
          subtitle="Use camera to scan physical pages"
          icon="camera"
          onPress={() => {}}
        />
        <SphereActionCard
          title="Import PDF"
          subtitle="Select a PDF from your device"
          icon="document-text"
          onPress={handleImportPDF}
        />
        <SphereActionCard
          title="Import Image"
          subtitle="Choose an image from your gallery"
          icon="image"
          onPress={handleImportImage}
        />
        <SphereActionCard
          title="Create Folder"
          subtitle="Organize your documents"
          icon="folder"
          onPress={handleCreateFolder}
        />
      </SphereSectionCard>
    </ScreenContainer>
  );
}
