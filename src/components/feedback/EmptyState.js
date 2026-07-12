import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const EmptyState = memo(({
  icon,
  iconName, // if provided, use Ionicons
  title,
  description,


  style,
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing[24] }, style]} testID={testID}>
      {(icon || iconName) && (
        <View style={[styles.iconContainer, { marginBottom: spacing[16] }]}>
          {icon ? icon : (
            <Ionicons name={iconName} size={64} color={colors.border} />
          )}
        </View>
      )}
      {title && (
        <Text style={[typography.h3, { color: colors.text.primary, textAlign: 'center', marginBottom: spacing[8] }]}>
          {title}
        </Text>
      )}
      {description && (
        <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing[24] }]}>
          {description}
        </Text>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
