import React, { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { EmptyState } from '../components/feedback/EmptyState';

export default function NotificationScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScreenContainer scrollable>
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

      <SpherePageHeader title="Notifications" />

      <SphereSectionCard>
        <EmptyState
          iconName="notifications-outline"
          title="All Caught Up"
          description="You don't have any new notifications."
        />
      </SphereSectionCard>
    </ScreenContainer>
  );
}
