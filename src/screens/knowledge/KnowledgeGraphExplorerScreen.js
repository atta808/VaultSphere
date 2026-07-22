import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, useTheme, Surface } from 'react-native-paper';

export default function KnowledgeGraphExplorerScreen() {
  const theme = useTheme();

  // Placeholder for hierarchical graph UI
  const mockNodes = [
    { id: '1', title: 'Invoice #1024', type: 'Document', related: ['Vendor A', 'Contract Q3'] },
    { id: '2', title: 'Vendor A', type: 'Entity', related: ['Invoice #1024', 'Invoice #1025'] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Knowledge Graph (Hierarchical View)</Text>
      <FlatList
        data={mockNodes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Surface style={styles.surface}>
            <List.Accordion
              title={item.title}
              description={`Type: ${item.type}`}
              left={props => <List.Icon {...props} icon="graph" />}>
              {item.related.map((rel, index) => (
                <List.Item key={index} title={rel} left={props => <List.Icon {...props} icon="link" />} />
              ))}
            </List.Accordion>
          </Surface>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16, fontWeight: 'bold' },
  surface: { marginBottom: 12, borderRadius: 8, elevation: 1 }
});
