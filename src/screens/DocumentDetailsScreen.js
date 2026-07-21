import React, { useState, useEffect } from 'react';
import { Logger } from '../utils/logger/Logger';
import { View, Alert } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereInfoRow } from '../components/common/SphereInfoRow';
import { EmptyState } from '../components/feedback/EmptyState';
import { SphereFAB } from '../components/buttons/SphereFAB';
import { useTheme } from '../hooks/useTheme';
import { useRoute, useNavigation } from '@react-navigation/native';
import VaultService from '../services/vault/VaultService';
import { DocumentIntelligenceCard } from '../components/cards/DocumentIntelligenceCard';
import { ROUTES } from '../config/routes';

export default function DocumentDetailsScreen() {
  const { spacing, colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { documentId } = route.params || {};

  const [document, setDocument] = useState(null);

  useEffect(() => {
    if (documentId) {
      VaultService.getDocument(documentId).then(setDocument).catch(Logger.error);
    }
  }, [documentId]);

  const handleFavoriteToggle = async () => {
    try {
      await VaultService.toggleFavorite(documentId);
      const updated = await VaultService.getDocument(documentId);
      setDocument(updated);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleRename = () => {
    Alert.prompt('Rename Document', 'Enter new name', async (text) => {
      if (text) {
        try {
          await VaultService.renameDocument(documentId, text);
          const updated = await VaultService.getDocument(documentId);
          setDocument(updated);
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }
    });
  };

  const handleDelete = async () => {
    Alert.alert('Delete', 'Are you sure you want to move this to the trash?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await VaultService.moveDocumentToTrash(documentId);
          navigation.goBack();
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }}
    ]);
  };

  if (!document) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenContainer scrollable padding={false}>
        <View style={{ paddingHorizontal: spacing[16], paddingTop: spacing[16] }}>
          <SpherePageHeader
            title="Document Details"
            subtitle={document.originalName || document.name}
          />
        </View>

        <View style={{ height: 250, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing[16] }}>
          <EmptyState
            iconName="document-text"
            title="Document Preview"
            description="Tap 'View' below to open the viewer."
          />
        </View>

        <View style={{ paddingHorizontal: spacing[16] }}>
          <SphereSectionCard title="Metadata">
            <SphereInfoRow label="Type" value={document.mimeType} />
            <SphereInfoRow label="Size" value={`${Math.round(document.size / 1024)} KB`} />
            <SphereInfoRow label="Created" value={new Date(document.createdAt).toLocaleDateString()} />
            <SphereInfoRow label="Modified" value={new Date(document.updatedAt).toLocaleDateString()} showDivider={false} />
          </SphereSectionCard>

          <SphereSectionCard title="Tags">
            <EmptyState
              iconName="pricetags-outline"
              title="No Tags"
              description="Add tags to help organize this document."
            />
          </SphereSectionCard>

          <DocumentIntelligenceCard documentId={documentId} />

          <View style={{ height: 100 }} />
        </View>
      </ScreenContainer>

      <View style={{ position: 'absolute', bottom: spacing[24], right: spacing[24], flexDirection: 'row', gap: spacing[16] }}>
        <SphereFAB
          icon="eye"
          mini
          onPress={() => navigation.navigate(ROUTES.DOCUMENT_VIEWER, { documentId })}
        />
        <SphereFAB
          icon={document.favorite ? "star" : "star-outline"}
          mini
          onPress={handleFavoriteToggle}
        />
        <SphereFAB
          icon="pencil"
          mini
          onPress={handleRename}
        />
        <SphereFAB
          icon="trash"
          extended
          label="Delete"
          onPress={handleDelete}
        />
      </View>
    </View>
  );
}
