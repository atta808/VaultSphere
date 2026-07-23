import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';

export const TrendExplorer = () => {
  return (
    <ScreenContainer>
      <SpherePageHeader title="Trend Explorer" subtitle="Analyze historical data trends" />
      <View style={{ padding: 16 }}><Text>Select a metric to explore its trends over time.</Text></View>
    </ScreenContainer>
  );
};
