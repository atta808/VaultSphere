import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereActionCard } from '../components/cards/SphereActionCard';
import { FolderSelector } from '../components/forms/FolderSelector';
import { DocumentImportService } from '../services/import/DocumentImportService';
import { ImageImportService } from '../services/import/ImageImportService';
import VaultService from '../services/vault/VaultService';
import { ROUTES } from '../config/routes';

export default function AddDocumentScreen() {
  const navigation = useNavigation();
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleImportDocuments = async () => {
    try {
      const files = await DocumentImportService.pickDocuments(true); // Allow multiple
      if (files.length > 0) {
        // Dispatch to background queue
        VaultService.importDocuments(files, selectedFolderId);

        // Navigate correctly based on count.
        // Note: the queue is asynchronous. We navigate to vault immediately.
        // The global progress handles feedback.
        if (files.length === 1) {
           navigation.navigate(ROUTES.VAULT); // We navigate back to Vault where it listens, we don't know the ID yet since it's queued.
        } else {
           navigation.navigate(ROUTES.VAULT);
        }
      }
    } catch (error) {
      Alert.alert('Error', `Failed to pick documents: ${error.message}`);
    }
  };

  const handleImportImages = async () => {
    try {
      const images = await ImageImportService.pickImages(true); // Allow multiple
      if (images.length > 0) {
        VaultService.importDocuments(images, selectedFolderId);
        navigation.navigate(ROUTES.VAULT);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to pick images: ${error.message}`);
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

      <FolderSelector
        selectedFolderId={selectedFolderId}
        onSelect={setSelectedFolderId}
      />

      <SphereSectionCard>
        <SphereActionCard
          title="Scan Document"
          subtitle="Use camera to scan physical pages"
          icon="camera"
          onPress={() => {}}
        />
        <SphereActionCard
          title="Import Documents"
          subtitle="Select files from your device"
          icon="document-text"
          onPress={handleImportDocuments}
        />
        <SphereActionCard
          title="Import Images"
          subtitle="Choose images from your gallery"
          icon="image"
          onPress={handleImportImages}
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
