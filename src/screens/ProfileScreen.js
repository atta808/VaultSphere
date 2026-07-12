import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereInfoRow } from '../components/common/SphereInfoRow';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';

export default function ProfileScreen() {
  const { spacing, colors, radius } = useTheme();

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Profile" />

      <View style={{ alignItems: 'center', marginBottom: spacing[32] }}>
        <View style={{ width: 100, height: 100, borderRadius: radius.round, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: spacing[16] }}>
           <EmptyState iconName="person" />
        </View>
        <SpherePageHeader title="John Doe" subtitle="john.doe@example.com" style={{ marginBottom: 0 }} />
      </View>

      <SphereSectionCard title="Account Details">
        <SphereInfoRow label="User ID" value="#8475839" />
        <SphereInfoRow label="Member Since" value="Oct 2023" />
        <SphereInfoRow label="Status" value="Active" showDivider={false} />
      </SphereSectionCard>

      <SphereSectionCard title="Statistics">
        <EmptyState
          iconName="bar-chart-outline"
          title="No Data"
          description="Statistics will appear here once you start using the vault."
        />
      </SphereSectionCard>

    </ScreenContainer>
  );
}
