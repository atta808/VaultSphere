import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ExecutiveInsightService } from '../../../services/enterprise/AnalyticsService';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';
import { SphereListItem } from '../../../components/lists/SphereListItem';

export const ExecutiveInsights = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    ExecutiveInsightService.getInsights().then(setInsights).catch(e => Alert.alert('Error', e.message));
  }, []);

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Executive Insights" subtitle="Narrative insights derived from analytics" />
      {insights.length === 0 ? (
        <View style={{ padding: 16 }}><Text>No insights available at this time.</Text></View>
      ) : (
        insights.map(i => (
          <SphereListItem key={i.id} title={i.title} subtitle={i.narrative} icon="bulb" showDivider />
        ))
      )}
    </ScreenContainer>
  );
};
