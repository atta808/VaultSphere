import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SummaryCard({ summaryText, keyPoints }) {
  const { colors, typography, spacing, radius } = useTheme();

  if (!summaryText && (!keyPoints || keyPoints.length === 0)) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: radius.md, margin: spacing.md, padding: spacing.md }]}>
      <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.sm }]}>AI Summary</Text>

      {summaryText ? (
        <Text style={[typography.body2, { color: colors.text.secondary, marginBottom: spacing.md }]}>{summaryText}</Text>
      ) : null}

      {keyPoints && keyPoints.length > 0 && (
        <View>
          <Text style={[typography.h4, { color: colors.text.primary, marginBottom: spacing.xs }]}>Key Points</Text>
          {keyPoints.map((point, index) => (
            <Text key={index} style={[typography.body2, { color: colors.text.secondary }]}>• {point}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  }
});
