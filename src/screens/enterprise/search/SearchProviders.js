import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, List } from 'react-native-paper';
import { SearchProviderRegistry } from '../../../services/enterprise/search/SearchProviderRegistry';

export const SearchProviders = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // We assume the Registry is initialized during app boot.
    setProviders(SearchProviderRegistry.getActiveProviders());
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Active Search Providers</Title>
        </Card.Content>
      </Card>

      {providers.map((p, i) => {
        const meta = p.getMetadata();
        return (
          <List.Item
            key={i}
            title={meta.name}
            description={`Type: ${meta.type} | Version: ${meta.version}`}
            left={props => <List.Icon {...props} icon="magnify-scan" />}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16 }
});
