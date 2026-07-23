import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

export const SavedSearches = () => (
  <View style={styles.container}>
    <Card>
      <Card.Content>
        <Title>Saved Searches</Title>
        <Text>Manage your frequently used search queries and filters.</Text>
      </Card.Content>
    </Card>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
