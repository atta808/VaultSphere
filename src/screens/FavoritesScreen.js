import React, { useState, useCallback } from 'react';
import { Logger } from '../utils/logger/Logger';
import { RefreshControl, Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import VaultService from '../services/vault/VaultService';
import { ROUTES } from '../config/routes';
import { useTheme } from '../hooks/useTheme';

export default function FavoritesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { spacing, colors } = useTheme();
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const favs = await VaultService.getFavorites();
      setFavorites(favs);
    } catch (e) {
      Logger.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  return (
    <ScreenContainer scrollable>
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

      <SpherePageHeader title="Favorites" />

      <SphereSectionCard>
        {favorites.length === 0 ? (
          <EmptyState
            iconName="star-outline"
            title="No Favorites Yet"
            description="Star your most important documents to access them quickly here."
          />
        ) : (
          favorites.map((doc) => (
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
    </ScreenContainer>
  );
}
