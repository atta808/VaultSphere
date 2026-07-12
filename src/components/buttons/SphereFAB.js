import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SphereFAB = memo(({
  icon,
  label,
  mini = false,
  extended = false,
  disabled = false,
  loading = false,
  onPress,
  style,
}) => {
  const { colors, typography, spacing, radius, shadows } = useTheme();

  const size = mini ? 40 : 56;
  const borderRadius = radius.round;

  const dynamicStyle = {
    backgroundColor: disabled ? colors.border : colors.primary,
    height: size,
    minWidth: extended ? undefined : size,
    borderRadius,
    paddingHorizontal: extended ? spacing[24] : 0,
    width: extended ? undefined : size,
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <TouchableOpacity
      style={[styles.container, shadows.md, dynamicStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={label || 'Floating Action Button'}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={mini ? 20 : 24} color={colors.surface} />}
          {extended && label && (
            <Text style={[{ color: colors.surface, marginLeft: icon ? spacing[8] : 0 }, typography.button]}>
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
});

SphereFAB.displayName = 'SphereFAB';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
