import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { KPIService } from '../../../services/enterprise/AnalyticsService';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';
import { SphereListItem } from '../../../components/lists/SphereListItem';

export const KPIManager = () => {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    KPIService.getKPIs().then(setKpis).catch(e => Alert.alert('Error', e.message));
  }, []);

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="KPI Manager" subtitle="Manage Key Performance Indicators" />
      {kpis.length === 0 ? (
        <View style={{ padding: 16 }}><Text>No KPIs configured yet.</Text></View>
      ) : (
        kpis.map(kpi => (
          <SphereListItem key={kpi.id} title={kpi.name} subtitle={`Value: ${kpi.currentValue}`} icon="speedometer" showDivider />
        ))
      )}
    </ScreenContainer>
  );
};
