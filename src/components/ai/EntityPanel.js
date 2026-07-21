import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function EntityPanel({ entities }) {
  const { colors, typography, spacing, radius } = useTheme();

  if (!entities || entities.length === 0) {
    return (
      <View style={[styles.emptyContainer, { margin: spacing.md }]}>
         <Text style={[typography.body2, { color: colors.text.secondary }]}>No entities extracted.</Text>
      </View>
    );
  }

  // Group entities by type
  const grouped = entities.reduce((acc, curr) => {
     if (!acc[curr.type]) acc[curr.type] = [];
     acc[curr.type].push(curr);
     return acc;
  }, {});

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
       <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.md }]}>Extracted Entities</Text>

       {Object.keys(grouped).map(type => (
         <View key={type} style={{ marginBottom: spacing.md }}>
            <Text style={[typography.h4, { color: colors.primary, marginBottom: spacing.xs }]}>{type.toUpperCase()}</Text>
            {grouped[type].map((entity, idx) => (
              <View key={idx} style={[styles.entityItem, { backgroundColor: colors.surface, borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.xs }]}>
                 <Text style={[typography.body1, { color: colors.text.primary }]}>{entity.value}</Text>
                 <Text style={[typography.caption, { color: colors.text.secondary }]}>Confidence: {(entity.confidence * 100).toFixed(0)}%</Text>
              </View>
            ))}
         </View>
       ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  entityItem: {
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  }
});
