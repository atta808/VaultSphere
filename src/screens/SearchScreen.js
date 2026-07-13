import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSearchBar } from '../components/forms/SphereSearchBar';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereListItem } from '../components/lists/SphereListItem';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';
import SearchService from '../services/SearchService';

export default function SearchScreen() {
  const { spacing, colors } = useTheme();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function performSearch() {
      if (search.length > 0) {
        const res = await SearchService.search(search);
        setResults(res);
      } else {
        setResults([]);
      }
    }
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Search" />

      <SphereSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Find documents, tags, or categories..."
        onClear={() => setSearch('')}
        style={{ marginBottom: spacing[24] }}
      />

      {search.length === 0 ? (
        <>
          <SphereSectionCard title="Recent Searches">
            <EmptyState
              iconName="time-outline"
              title="No Recent Searches"
              description="Your search history will appear here."
            />
          </SphereSectionCard>

          <SphereSectionCard title="Suggested Categories">
            <View style={{ backgroundColor: 'transparent' }}>
              <SphereListItem title="Financial" icon="cash-outline" rightIcon={null} />
              <SphereListItem title="Medical" icon="medical-outline" rightIcon={null} />
              <SphereListItem title="Personal" icon="person-outline" rightIcon={null} />
            </View>
          </SphereSectionCard>
        </>
      ) : (
        results.length > 0 ? (
          <SphereSectionCard title="Search Results">
            {results.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={{ padding: spacing[8], borderBottomWidth: 1, borderColor: colors.border }}
                onPress={() => navigation.navigate(ROUTES.DOCUMENT_DETAILS, { documentId: doc.id })}
              >
                <Text style={{ color: colors.text }}>{doc.originalName || doc.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{doc.mimeType}</Text>
              </TouchableOpacity>
            ))}
          </SphereSectionCard>
        ) : (
          <EmptyState
            iconName="search-outline"
            title="No Results Found"
            description={`We couldn't find anything matching "${search}".`}
          />
        )
      )}
    </ScreenContainer>
  );
}
