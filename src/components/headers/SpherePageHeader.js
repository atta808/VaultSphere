import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const SpherePageHeader = memo(({ title, subtitle, rightElement, style }) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing[24] }, style]}>
      <View style={styles.textContainer}>
        <Text style={[{ color: colors.text.primary }, typography.h1]}>{title}</Text>
        {subtitle && (
          <Text style={[{ color: colors.text.secondary, marginTop: spacing[4] }, typography.body1]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && (
        <View style={styles.rightContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
});

SpherePageHeader.displayName = 'SpherePageHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: 16,
  },
});
