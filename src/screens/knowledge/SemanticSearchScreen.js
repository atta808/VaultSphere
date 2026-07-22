import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Text, Card, useTheme } from 'react-native-paper';

export default function SemanticSearchScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder for search results
  const [results] = useState([
    { id: '1', docName: 'Q3 Financials', snippet: 'Contextually relevant chunk matching the intent...', score: 0.92 }
  ]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Ask a question or search concepts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <Text style={styles.subtitle}>Hybrid Search Results</Text>
      <FlatList
        data={searchQuery.length > 2 ? results : []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.docName} subtitle={`Relevance: ${(item.score * 100).toFixed(0)}%`} />
            <Card.Content>
              <Text>{item.snippet}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchbar: { marginBottom: 16 },
  subtitle: { marginBottom: 12, fontWeight: 'bold', fontSize: 16 },
  card: { marginBottom: 12 }
});
