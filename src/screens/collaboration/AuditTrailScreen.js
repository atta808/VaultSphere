import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import AuditTrailService from '../../services/collaboration/AuditTrailService';

export default function AuditTrailScreen() {
  const { colors, spacing } = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await AuditTrailService.getAuditLogs(50);
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing[32] }} />
      ) : (
        <ScrollView>
          <List.Section>
            {logs.length === 0 ? (
              <Text style={[{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing[32] }]}>
                No audit logs found.
              </Text>
            ) : (
              logs.map(log => (
                <List.Item
                  key={log.id}
                  title={log.action}
                  description={`${new Date(log.timestamp).toLocaleString()} - ${log.resourceType}:${log.resourceId}`}
                  left={props => <List.Icon {...props} icon="shield-check" />}
                />
              ))
            )}
          </List.Section>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
