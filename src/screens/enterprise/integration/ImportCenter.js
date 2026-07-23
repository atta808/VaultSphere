import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';

export const ImportCenter = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Import Center</Title>
          <Text>Manage data imports from external systems.</Text>
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
