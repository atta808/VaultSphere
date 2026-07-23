import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';
import { SphereListItem } from '../../../components/lists/SphereListItem';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../config/routes';

export const AnalyticsCenter = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Analytics Center" subtitle="Business Intelligence Platform" />

      <SphereListItem title="Executive Dashboard" icon="pie-chart" onPress={() => navigation.navigate(ROUTES.EXECUTIVE_DASHBOARD)} showDivider />
      <SphereListItem title="KPI Manager" icon="speedometer" onPress={() => navigation.navigate(ROUTES.KPI_MANAGER)} showDivider />
      <SphereListItem title="Report Center" icon="document-text" onPress={() => navigation.navigate(ROUTES.REPORT_CENTER)} showDivider />
      <SphereListItem title="Trend Explorer" icon="trending-up" onPress={() => navigation.navigate(ROUTES.TREND_EXPLORER)} showDivider />
      <SphereListItem title="Forecast Center" icon="pulse" onPress={() => navigation.navigate(ROUTES.FORECAST_CENTER)} showDivider />
      <SphereListItem title="Executive Insights" icon="bulb" onPress={() => navigation.navigate(ROUTES.EXECUTIVE_INSIGHTS)} showDivider />
      <SphereListItem title="Dashboard Designer" icon="color-palette" onPress={() => navigation.navigate(ROUTES.DASHBOARD_DESIGNER)} />

    </ScreenContainer>
  );
};
