import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

export const SearchAnalytics = () => (
  <View style={styles.container}>
    <Card>
      <Card.Content>
        <Title>Search Analytics</Title>
        <Text>View aggregated query metrics, response times, and provider usage trends.</Text>
      </Card.Content>
    </Card>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
