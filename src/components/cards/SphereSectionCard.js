import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const SphereSectionCard = memo(({
  title,
  children,
  action,
  style,
}) => {
  const { colors, typography, spacing, radius, shadows } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing[16],
        marginBottom: spacing[16],
      },
      shadows.sm,
      style
    ]}>
      {(title || action) && (
        <View style={[styles.header, { marginBottom: spacing[16] }]}>
          {title && (
            <Text style={[{ color: colors.text.primary, flex: 1 }, typography.h3]}>
              {title}
            </Text>
          )}
          {action && action}
        </View>
      )}
      {children}
    </View>
  );
});

SphereSectionCard.displayName = 'SphereSectionCard';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
