import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ReportingService } from '../../../services/enterprise/AnalyticsService';
import { ScreenContainer } from '../../../components/layout/ScreenContainer';
import { SpherePageHeader } from '../../../components/headers/SpherePageHeader';
import { SphereListItem } from '../../../components/lists/SphereListItem';
import SessionService from '../../../services/security/SessionService';

export const ReportCenter = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const userSession = await SessionService.getSession();
      const userId = userSession ? userSession.userId : 'system';
      const fetchedReports = await ReportingService.getReports(userId);
      setReports(fetchedReports);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Report Center" subtitle="Generate and view reports" />
      {reports.length === 0 ? (
        <View style={{ padding: 16 }}><Text>No reports generated yet.</Text></View>
      ) : (
        reports.map(r => (
          <SphereListItem key={r.id} title={r.name} subtitle={r.status} icon="document-text" showDivider />
        ))
      )}
    </ScreenContainer>
  );
};
