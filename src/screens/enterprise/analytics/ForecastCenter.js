import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';

export const ForecastCenter = () => {
  return (
    <ScreenContainer>
      <SpherePageHeader title="Forecast Center" subtitle="Predictive Analytics and Capacity Planning" />
      <View style={{ padding: 16 }}><Text>Statistical forecasting models go here.</Text></View>
    </ScreenContainer>
  );
};
