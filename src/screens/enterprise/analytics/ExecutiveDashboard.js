import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { DashboardService } from '../../../services/enterprise/AnalyticsService';
import { DataAggregationService } from '../../../services/enterprise/AnalyticsService';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SphereStatCard } from '../../../components/cards/SphereStatCard';
import { useTheme } from '../../../hooks/useTheme';
import SessionService from '../../../services/security/SessionService';

export const ExecutiveDashboard = () => {
  const { spacing } = useTheme();
  const [widgets, setWidgets] = useState([]);
  const [widgetData, setWidgetData] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userSession = await SessionService.getSession();
      const userId = userSession ? userSession.userId : 'system';

      await DashboardService.initializeDefaultDashboardIfNeeded(userId);
      const dashboards = await DashboardService.getDashboards(userId);
      const execDash = dashboards.find(d => d.name === 'Executive Dashboard');

      if (execDash) {
        const dbWidgets = await DashboardService.getWidgetsForDashboard(execDash.id, userId);
        setWidgets(dbWidgets);

        const dataMap = {};
        for (const w of dbWidgets) {
          const val = await DataAggregationService.getWidgetData(w.dataSource);
          dataMap[w.id] = val;
        }
        setWidgetData(dataMap);
      }
    } catch (e) {
      Alert.alert('Analytics Error', e.message);
    }
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={{ paddingBottom: spacing[32] }}>
      <SpherePageHeader title="Executive Dashboard" subtitle="Enterprise Overview" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[16], paddingHorizontal: spacing[16] }}>
        {widgets.map(w => (
          <View key={w.id} style={{ width: '47%' }}>
            <SphereStatCard
              title={w.title}
              value={widgetData[w.id] !== undefined ? String(widgetData[w.id]) : "---"}
              icon="analytics-outline"
            />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});
