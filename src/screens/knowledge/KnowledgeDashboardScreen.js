import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';

export default function KnowledgeDashboardScreen({ navigation }) {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Title style={styles.header}>Enterprise Knowledge Graph</Title>

      <Card style={styles.card} onPress={() => navigation.navigate('SemanticSearch')}>
        <Card.Content>
          <Title>Semantic Search</Title>
          <Paragraph>Search documents by meaning and context.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate('KnowledgeGraphExplorer')}>
        <Card.Content>
          <Title>Knowledge Graph Explorer</Title>
          <Paragraph>Explore relationships between documents, entities, and topics.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate('AITopics')}>
        <Card.Content>
          <Title>AI Topics</Title>
          <Paragraph>Browse auto-generated document categories.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate('Recommendations')}>
        <Card.Content>
          <Title>Recommendations</Title>
          <Paragraph>Discover similar documents and related workflows.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card} onPress={() => navigation.navigate('RelationshipManager')}>
        <Card.Content>
          <Title>Relationship Manager</Title>
          <Paragraph>Manually create and review document connections.</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  }
});
