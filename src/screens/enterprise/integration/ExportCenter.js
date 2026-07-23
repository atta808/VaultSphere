import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';

export const ExportCenter = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Export Center</Title>
          <Text>Manage data exports to external systems.</Text>
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
