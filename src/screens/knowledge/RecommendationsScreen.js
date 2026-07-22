import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, useTheme } from 'react-native-paper';

export default function RecommendationsScreen() {
  const theme = useTheme();
  const mockRecommendations = [
    { id: '1', title: 'Vendor Contract B', reason: 'Similar to Contract A (Viewed recently)' },
    { id: '2', title: 'Tax Docs Folder', reason: 'Frequently accessed with Q3 Financials' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Intelligent Recommendations</Text>
      <FlatList
        data={mockRecommendations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.reason}
            left={props => <List.Icon {...props} icon="star-four-points" />}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16, fontWeight: 'bold' }
});
