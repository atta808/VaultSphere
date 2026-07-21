import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function MessageBubble({ message }) {
  const { colors, typography, spacing, radius } = useTheme();

  const isUser = message.role === 'user';

  return (
    <View style={[
      styles.container,
      {
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? colors.primary : colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        marginVertical: spacing.xs,
        maxWidth: '85%'
      }
    ]}>
      <Text style={[
        typography.body1,
        { color: isUser ? colors.background : colors.text.primary }
      ]}>
        {message.content}
      </Text>

      {message.citations && message.citations.length > 0 && (
        <View style={[styles.citationContainer, { borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.xs }]}>
          <Text style={[typography.caption, { color: isUser ? colors.background : colors.text.secondary }]}>Citations:</Text>
          {message.citations.map((cit, i) => (
             <Text key={i} style={[typography.caption, { color: isUser ? colors.background : colors.text.secondary }]}>
                • Pg {cit.pageNumber}: "{cit.snippet.substring(0, 30)}..."
             </Text>
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
  },
  citationContainer: {
    borderTopWidth: 1,
  }
});
