import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

export const SearchSettings = () => (
  <View style={styles.container}>
    <Card>
      <Card.Content>
        <Title>Search Settings</Title>
        <Text>Configure federated search weights, indexing frequency, and permissions.</Text>
      </Card.Content>
    </Card>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
