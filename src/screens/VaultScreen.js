import React, { useState, useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSearchBar } from '../components/forms/SphereSearchBar';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { SphereFAB } from '../components/buttons/SphereFAB';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';

export default function VaultScreen() {
  const navigation = useNavigation();
  const { spacing, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

        <SphereSectionCard title="Categories">
          <EmptyState
            iconName="folder-open-outline"
            title="No Categories"
            description="Create categories to organize your vault."
          />
        </SphereSectionCard>

        <SphereSectionCard title="All Documents">
          <EmptyState
            iconName="shield-checkmark-outline"
            title="Your Vault is Empty"
            description="Start adding documents to keep them secure."
          />
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
