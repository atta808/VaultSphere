import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSearchBar } from '../components/forms/SphereSearchBar';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereListItem } from '../components/lists/SphereListItem';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';

export default function SearchScreen() {
  const { spacing } = useTheme();
  const [search, setSearch] = useState('');

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
        <EmptyState
          iconName="search-outline"
          title="No Results Found"
          description={`We couldn't find anything matching "${search}".`}
        />
      )}
    </ScreenContainer>
  );
}
