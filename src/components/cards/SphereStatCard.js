import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SphereStatCard = memo(({
  title,
  value,
  icon,
  iconColor,
  trend, // e.g., '+5%', '-2%'
  trendPositive = true,
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
      },
      shadows.sm,
      style
    ]}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.background, borderRadius: radius.md, marginBottom: spacing[12] }]}>
            <Ionicons name={icon} size={24} color={iconColor || colors.primary} />
          </View>
        )}
      </View>
      <Text style={[{ color: colors.text.secondary, marginBottom: spacing[4] }, typography.caption]}>
        {title}
      </Text>
      <View style={styles.valueRow}>
        <Text style={[{ color: colors.text.primary }, typography.h2]}>
          {value}
        </Text>
        {trend && (
          <Text style={[
            { marginLeft: spacing[8] },
            typography.caption,
            { color: trendPositive ? colors.success : colors.danger }
          ]}>
            {trend}
          </Text>
        )}
      </View>
    </View>
  );
});

SphereStatCard.displayName = 'SphereStatCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
