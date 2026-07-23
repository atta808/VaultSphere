import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';

export const ConnectorHealth = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Connector Health</Title>
          <Text>View health metrics for active connectors.</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
