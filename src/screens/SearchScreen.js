import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSearchBar } from '../components/forms/SphereSearchBar';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereListItem } from '../components/lists/SphereListItem';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';
import SearchService from '../services/SearchService';
import SearchHistoryService from '../services/SearchHistoryService';
import SmartCollectionService from '../services/SmartCollectionService';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { HighlightedText } from '../utils/textHighlight';

export default function SearchScreen() {
  const { spacing, colors, typography } = useTheme();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedSearch(search, 300);

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [collections, setCollections] = useState({
    recent: [],
    favorites: [],
  });

  const loadInitialData = async () => {
    const history = await SearchHistoryService.getHistory(5);
    setRecentSearches(history);

    const faves = await SmartCollectionService.getFavorites(3);
    setCollections(prev => ({ ...prev, favorites: faves }));
  };

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  useEffect(() => {
    let isActive = true;

    async function performSearch() {
      if (debouncedSearch.trim().length > 0) {
        setIsSearching(true);
        const res = await SearchService.search(debouncedSearch);
        if (isActive) {
          setResults(res);
          setIsSearching(false);
        }
        await SearchHistoryService.addSearch(debouncedSearch);
      } else {
        if (isActive) {
          setResults([]);
          setIsSearching(false);
        }
      }
    }

    performSearch();

    return () => {
      isActive = false;
    };
  }, [debouncedSearch]);

  const handleClearHistory = async () => {
    await SearchHistoryService.clearHistory();
    setRecentSearches([]);
  };

  // Dummy filters for UI layout purposes (since we don't have the routing yet for these specific filtered views)
  const filters = ['Documents', 'Images', 'PDFs', 'Scans'];

  const renderEmptyState = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing[16] }}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={{
              backgroundColor: colors.surfaceVariant,
              paddingHorizontal: spacing[16],
              paddingVertical: spacing[8],
              borderRadius: spacing[16],
              marginRight: spacing[8]
            }}
          >
            <Text style={{ color: colors.text }}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {recentSearches.length > 0 && (
        <SphereSectionCard title="Recent Searches">
          {recentSearches.map((item) => (
            <SphereListItem
              key={item.id}
              title={item.query}
              icon="time-outline"
              onPress={() => setSearch(item.query)}
            />
          ))}
          <TouchableOpacity onPress={handleClearHistory} style={{ marginTop: spacing[12], padding: spacing[8] }}>
            <Text style={{ color: colors.error, textAlign: 'center' }}>Clear History</Text>
          </TouchableOpacity>
        </SphereSectionCard>
      )}

      {collections.favorites.length > 0 && (
        <SphereSectionCard title="Favorites">
          {collections.favorites.map((doc) => (
            <SphereListItem
              key={doc.id}
              title={doc.originalName || doc.name}
              icon="star"
              iconColor={colors.warning}
              description={doc.mimeType}
              onPress={() => navigation.navigate(ROUTES.DOCUMENT_DETAILS, { documentId: doc.id })}
            />
          ))}
        </SphereSectionCard>
      )}

      <SphereSectionCard title="Smart Collections">
        <View style={{ backgroundColor: 'transparent' }}>
          <SphereListItem
            title="OCR Completed"
            icon="document-text-outline"
            onPress={() => { /* Navigate to collection view if implemented */ }}
          />
          <SphereListItem
            title="Large Files"
            icon="folder-open-outline"
            onPress={() => { /* Navigate to collection view if implemented */ }}
          />
        </View>
      </SphereSectionCard>
    </ScrollView>
  );

  return (
    <ScreenContainer>
      <SpherePageHeader title="Search" />

      <SphereSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Find documents, tags, or text..."
        onClear={() => setSearch('')}
        style={{ marginBottom: spacing[16] }}
      />

      <View style={{ flex: 1 }}>
        {search.length === 0 ? (
          renderEmptyState()
        ) : isSearching ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : results.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <SphereSectionCard title="Search Results">
              {results.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={{
                    paddingVertical: spacing[12],
                    borderBottomWidth: 1,
                    borderColor: colors.border
                  }}
                  onPress={() => navigation.navigate(ROUTES.DOCUMENT_DETAILS, { documentId: doc.id })}
                >
                  <HighlightedText
                    text={doc.originalName || doc.name}
                    highlight={search}
                    highlightStyle={{ fontWeight: 'bold', color: colors.primary }}
                    baseStyle={{ color: colors.text, fontSize: 16 }}
                  />
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: spacing[4] }}>
                    {doc.mimeType}
                  </Text>
                </TouchableOpacity>
              ))}
            </SphereSectionCard>
          </ScrollView>
        ) : (
          <EmptyState
            iconName="search-outline"
            title="No Results Found"
            description={`We couldn't find anything matching "${search}".`}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
