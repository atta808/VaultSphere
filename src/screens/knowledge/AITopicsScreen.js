import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';

export default function AITopicsScreen() {
  const theme = useTheme();
  const mockTopics = ['Finance', 'Legal', 'Q3 Report', 'Onboarding'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>AI Extracted Topics</Text>
      <View style={styles.chipContainer}>
        {mockTopics.map((topic, idx) => (
          <Chip key={idx} style={styles.chip} onPress={() => {}}>{topic}</Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16, fontWeight: 'bold' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { margin: 4 }
});
