import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';

export const ApiManager = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>API Manager</Title>
          <Text>Manage internal API access and routing configurations.</Text>
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
