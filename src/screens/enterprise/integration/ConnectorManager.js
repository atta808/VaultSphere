import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Button, List } from 'react-native-paper';
import { ConnectorRegistry } from '../../../services/enterprise/integration/ConnectorRegistry';

export const ConnectorManager = () => {
  const [connectors, setConnectors] = useState([]);

  useEffect(() => {
    // Load registered connectors
    setConnectors(ConnectorRegistry.getAllConnectors());
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Available Connectors</Title>
        </Card.Content>
      </Card>

      {connectors.map((connector, index) => {
        const metadata = connector.getMetadata();
        return (
          <List.Item
            key={index}
            title={metadata.name}
            description={`Version: ${metadata.version} - Type: ${metadata.type}`}
            left={props => <List.Icon {...props} icon="puzzle" />}
            right={props => <Button {...props} mode="contained" onPress={() => {}}>Install</Button>}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});
