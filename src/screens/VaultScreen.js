import React, { useState, useCallback } from 'react';
import { RefreshControl, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSearchBar } from '../components/forms/SphereSearchBar';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { SphereFAB } from '../components/buttons/SphereFAB';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';
import VaultService from '../services/vault/VaultService';

export default function VaultScreen() {
  const navigation = useNavigation();
  const { spacing, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);

  const loadVaultData = async () => {
    try {
      const docs = await VaultService.getAllDocuments();
      const flds = await VaultService.getAllFolders();
      // Filter out deleted docs
      setDocuments(docs.filter(d => !d.deletedAt));
      setFolders(flds);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVaultData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadVaultData();
    setRefreshing(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenContainer scrollable>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

        <SpherePageHeader
          title="My Vault"
          subtitle="All your secure documents in one place."
        />

        <SphereSearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search in vault..."
          onClear={() => setSearch('')}
          style={{ marginBottom: spacing[24] }}
        />

        <SphereSectionCard title="Folders">
          {folders.length === 0 ? (
            <EmptyState
              iconName="folder-open-outline"
              title="No Folders"
              description="Create folders to organize your vault."
            />
          ) : (
            folders.map((folder) => (
              <View key={folder.id} style={{ padding: spacing[8], borderBottomWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.text }}>{folder.name}</Text>
              </View>
            ))
          )}
        </SphereSectionCard>

        <SphereSectionCard title="All Documents">
          {documents.length === 0 ? (
            <EmptyState
              iconName="shield-checkmark-outline"
              title="Your Vault is Empty"
              description="Start adding documents to keep them secure."
            />
          ) : (
            documents.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={{ padding: spacing[8], borderBottomWidth: 1, borderColor: colors.border }}
                onPress={() => navigation.navigate(ROUTES.DOCUMENT_DETAILS, { documentId: doc.id })}
              >
                <Text style={{ color: colors.text }}>{doc.originalName || doc.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{doc.mimeType}</Text>
              </TouchableOpacity>
            ))
          )}
        </SphereSectionCard>

        <View style={{ height: 80 }} />
      </ScreenContainer>

      <View style={{ position: 'absolute', bottom: spacing[24], right: spacing[24] }}>
        <SphereFAB
          icon="add"
          onPress={() => navigation.navigate(ROUTES.ADD_DOCUMENT)}
        />
      </View>
    </View>
  );
}
