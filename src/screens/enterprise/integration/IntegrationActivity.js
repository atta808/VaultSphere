import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';

export const IntegrationActivity = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Integration Activity</Title>
          <Text>View recent syncs, imports, exports, and errors.</Text>
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
