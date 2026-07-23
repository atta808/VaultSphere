import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../config/routes';

export const IntegrationHub = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Enterprise Integration Hub</Title>
          <Paragraph>Manage your enterprise integrations, connectors, and APIs in one place.</Paragraph>
        </Card.Content>
      </Card>

      <List.Section>
        <List.Subheader>Core Components</List.Subheader>
        <List.Item
          title="Connector Manager"
          description="Install, configure, and monitor external connectors."
          left={props => <List.Icon {...props} icon="connection" />}
          onPress={() => navigation.navigate(ROUTES.CONNECTOR_MANAGER)}
        />
        <List.Item
          title="API Manager"
          description="Manage internal APIs and access tokens."
          left={props => <List.Icon {...props} icon="api" />}
          onPress={() => navigation.navigate(ROUTES.API_MANAGER)}
        />
        <List.Item
          title="Webhook Manager"
          description="Configure incoming and outgoing webhooks."
          left={props => <List.Icon {...props} icon="webhook" />}
          onPress={() => navigation.navigate(ROUTES.WEBHOOK_MANAGER)}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Data Tools</List.Subheader>
        <List.Item
          title="Import Center"
          description="Import data from external systems."
          left={props => <List.Icon {...props} icon="import" />}
          onPress={() => navigation.navigate(ROUTES.IMPORT_CENTER)}
        />
        <List.Item
          title="Export Center"
          description="Export data to external formats."
          left={props => <List.Icon {...props} icon="export" />}
          onPress={() => navigation.navigate(ROUTES.EXPORT_CENTER)}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Monitoring</List.Subheader>
        <List.Item
          title="Connector Health"
          description="View health metrics for active connectors."
          left={props => <List.Icon {...props} icon="heart-pulse" />}
          onPress={() => navigation.navigate(ROUTES.CONNECTOR_HEALTH)}
        />
        <List.Item
          title="Integration Activity"
          description="View recent syncs, imports, exports, and errors."
          left={props => <List.Icon {...props} icon="history" />}
          onPress={() => navigation.navigate(ROUTES.INTEGRATION_ACTIVITY)}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
});
