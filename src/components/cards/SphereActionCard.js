import React, { memo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SphereActionCard = memo(({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
  style,
}) => {
  const { colors, typography, spacing, radius, shadows } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing[16],
          marginBottom: spacing[16],
        },
        shadows.sm,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.background, borderRadius: radius.md, marginRight: spacing[16] }]}>
        <Ionicons name={icon} size={28} color={iconColor || colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[{ color: colors.text.primary }, typography.subtitle1]}>{title}</Text>
        {subtitle && (
          <Text style={[{ color: colors.text.secondary, marginTop: spacing[4] }, typography.body2]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
    </TouchableOpacity>
  );
});

SphereActionCard.displayName = 'SphereActionCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});
