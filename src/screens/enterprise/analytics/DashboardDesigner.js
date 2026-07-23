import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';

export const DashboardDesigner = () => {
  return (
    <ScreenContainer>
      <SpherePageHeader title="Dashboard Designer" subtitle="Configure custom layouts" />
      <View style={{ padding: 16 }}><Text>Drag and drop widgets to design dashboards.</Text></View>
    </ScreenContainer>
  );
};
