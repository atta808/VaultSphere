import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function ComparisonScreen({ route }) {
  const { colors, typography, spacing, radius } = useTheme();
  // Expect diffData in route params
  const diffData = route?.params?.diffData || [];
  const changeSummary = route?.params?.changeSummary || 'No summary available.';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
         <Text style={[typography.h2, { color: colors.text.primary }]}>Document Comparison</Text>
      </View>

      <View style={[styles.summaryContainer, { backgroundColor: colors.surface, margin: spacing.md, padding: spacing.md, borderRadius: radius.md }]}>
         <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.xs }]}>AI Summary</Text>
         <Text style={[typography.body2, { color: colors.text.secondary }]}>{changeSummary}</Text>
      </View>

      <ScrollView style={styles.diffContainer} contentContainerStyle={{ padding: spacing.md }}>
         <Text>
           {diffData.map((part, index) => {
             const style = part.added
                ? { backgroundColor: colors.success + '40', color: colors.success }
                : part.removed
                   ? { backgroundColor: colors.error + '40', color: colors.error, textDecorationLine: 'line-through' }
                   : { color: colors.text.primary };

             return (
               <Text key={index} style={[typography.body1, style]}>
                 {part.value}
               </Text>
             );
           })}
         </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  summaryContainer: {
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  diffContainer: {
    flex: 1,
  }
});
