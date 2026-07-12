import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereInfoRow } from '../components/common/SphereInfoRow';
import { EmptyState } from '../components/feedback/EmptyState';
import { SphereFAB } from '../components/buttons/SphereFAB';
import { useTheme } from '../hooks/useTheme';

export default function DocumentDetailsScreen() {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenContainer scrollable padding={false}>
        <View style={{ paddingHorizontal: spacing[16], paddingTop: spacing[16] }}>
          <SpherePageHeader
            title="Document Details"
            subtitle="Placeholder.pdf"
          />
        </View>

        <View style={{ height: 250, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing[16] }}>
          <EmptyState
            iconName="document-text"
            title="Document Preview"
            description="Preview is not available for this placeholder."
          />
        </View>

        <View style={{ paddingHorizontal: spacing[16] }}>
          <SphereSectionCard title="Metadata">
            <SphereInfoRow label="Type" value="PDF Document" />
            <SphereInfoRow label="Size" value="2.4 MB" />
            <SphereInfoRow label="Created" value="Oct 12, 2023" />
            <SphereInfoRow label="Modified" value="Oct 12, 2023" showDivider={false} />
          </SphereSectionCard>

          <SphereSectionCard title="Tags">
            <EmptyState
              iconName="pricetags-outline"
              title="No Tags"
              description="Add tags to help organize this document."
            />
          </SphereSectionCard>

          <View style={{ height: 100 }} />
        </View>
      </ScreenContainer>

      <View style={{ position: 'absolute', bottom: spacing[24], right: spacing[24], flexDirection: 'row', gap: spacing[16] }}>
        <SphereFAB
          icon="share-social"
          mini
          onPress={() => {}}
        />
        <SphereFAB
          icon="pencil"
          extended
          label="Edit"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
