import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

export const ProviderHealth = () => (
  <View style={styles.container}>
    <Card>
      <Card.Content>
        <Title>Provider Health</Title>
        <Text>Monitor latency and status for all active search connectors.</Text>
      </Card.Content>
    </Card>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
