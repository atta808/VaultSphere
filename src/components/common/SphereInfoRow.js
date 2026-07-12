import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const SphereInfoRow = memo(({
  label,
  value,
  showDivider = true,
  style,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={style}>
      <View style={[styles.container, { paddingVertical: spacing[12] }]}>
        <Text style={[{ color: colors.text.secondary, flex: 1 }, typography.body2]}>
          {label}
        </Text>
        <Text style={[{ color: colors.text.primary, flex: 2, textAlign: 'right' }, typography.body1]}>
          {value}
        </Text>
      </View>
      {showDivider && (
        <View style={{ height: 1, backgroundColor: colors.border }} />
      )}
    </View>
  );
});

SphereInfoRow.displayName = 'SphereInfoRow';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
