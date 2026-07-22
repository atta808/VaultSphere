import React, { useState, useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereActionCard } from '../components/cards/SphereActionCard';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereStatCard } from '../components/cards/SphereStatCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { spacing } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={{ paddingBottom: spacing[32] }}
    >
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

      <SpherePageHeader
        title="Good Morning"
        subtitle="Your vault is secure."
      />

      <View style={{ flexDirection: 'row', gap: spacing[16], marginBottom: spacing[24] }}>
        <SphereStatCard
          title="Total Documents"
          value="0"
          icon="document-text"
        />
        <SphereStatCard
          title="Storage Used"
          value="0 MB"
          icon="cloud"
        />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[16], marginBottom: spacing[24] }}>
        <SphereStatCard
          title="Pending Approvals"
          value="0"
          icon="check-decagram"
          onPress={() => navigation.navigate(ROUTES.SETTINGS_STACK, { screen: ROUTES.WORKFLOW_STACK, params: { screen: ROUTES.APPROVAL_INBOX }})}
        />
        <SphereStatCard
          title="My Tasks"
          value="0"
          icon="format-list-checks"
          onPress={() => navigation.navigate(ROUTES.SETTINGS_STACK, { screen: ROUTES.WORKFLOW_STACK, params: { screen: ROUTES.MY_TASKS }})}
        />
      </View>

      <SphereSectionCard title="Quick Actions">
        <SphereActionCard
          title="Add Document"
          subtitle="Scan or import a new file"
          icon="add-circle"
          onPress={() => navigation.navigate(ROUTES.VAULT_STACK, { screen: ROUTES.ADD_DOCUMENT })}
        />
        <SphereActionCard
          title="Favorites"
          subtitle="View your starred items"
          icon="star"
          onPress={() => navigation.navigate(ROUTES.FAVORITES)}
        />
        <SphereActionCard
          title="Notifications"
          subtitle="Check your recent alerts"
          icon="notifications"
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        />
      </SphereSectionCard>

      <SphereSectionCard title="Recent Documents">
        <EmptyState
          iconName="document-text-outline"
          title="No Recent Documents"
          description="Documents you view or add recently will appear here."
        />
      </SphereSectionCard>

    </ScreenContainer>
  );
}
