import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Searchbar, Button, List, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../config/routes';
import { FederatedSearchService } from '../../../services/enterprise/search/FederatedSearchService';

export const EnterpriseSearch = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      // Execute the federated search via the Query Planner (wrapped in Service)
      const res = await FederatedSearchService.search(searchQuery, { searchType: 'federated' });
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Enterprise Search (Local + External)"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={performSearch}
        loading={loading}
        style={styles.searchbar}
      />

      <View style={styles.quickLinks}>
        <Button mode="text" onPress={() => navigation.navigate(ROUTES.SEARCH_PROVIDERS)}>Providers</Button>
        <Button mode="text" onPress={() => navigation.navigate(ROUTES.SAVED_SEARCHES)}>Saved</Button>
        <Button mode="text" onPress={() => navigation.navigate(ROUTES.SEARCH_ANALYTICS)}>Analytics</Button>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <Card key={index} style={styles.resultCard}>
            <Card.Content>
              <Title>{result.title}</Title>
              <Text>{result.snippet}</Text>
              <View style={styles.meta}>
                <Chip icon="database" style={styles.chip}>{result.providerId}</Chip>
                <Chip icon="file" style={styles.chip}>{result.documentType}</Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
        {results.length === 0 && !loading && searchQuery && (
          <Text style={styles.empty}>No results found across providers.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchbar: { marginBottom: 12 },
  quickLinks: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  resultsContainer: { flex: 1 },
  resultCard: { marginBottom: 12 },
  meta: { flexDirection: 'row', marginTop: 8 },
  chip: { marginRight: 8 },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' }
});
