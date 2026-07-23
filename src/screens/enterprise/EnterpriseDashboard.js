import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../config/routes';

export const EnterpriseDashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.header}>Enterprise Dashboard</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Records Awaiting Review</Title>
          <Text>0 records</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Active Legal Holds</Title>
          <Text>0 holds</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Compliance Alerts</Title>
          <Text>All systems nominal</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Integrations</Title>
          <Text>Manage external connectors and data pipelines.</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate(ROUTES.INTEGRATION_HUB)}>Open Integration Hub</Button>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Enterprise Search</Title>
          <Text>Federated search across internal and external knowledge bases.</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate(ROUTES.ENTERPRISE_SEARCH)}>Open Search Portal</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});
