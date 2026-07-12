import React, { memo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SphereListItem = memo(({
  title,
  subtitle,
  icon,
  iconColor,
  onPress,
  rightIcon = 'chevron-forward',
  rightContent,
  disabled = false,
  showDivider = false,
}) => {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {
            paddingVertical: spacing[16],
            paddingHorizontal: spacing[16],
            opacity: disabled ? 0.5 : 1,
            backgroundColor: colors.surface,
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={subtitle}
        accessibilityState={{ disabled }}
      >
        {icon && (
          <View style={[styles.iconContainer, { marginRight: spacing[16], backgroundColor: colors.background, borderRadius: radius.md }]}>
            <Ionicons name={icon} size={24} color={iconColor || colors.primary} />
          </View>
        )}
        <View style={styles.contentContainer}>
          <Text style={[{ color: colors.text.primary }, typography.body1]}>{title}</Text>
          {subtitle && (
            <Text style={[{ color: colors.text.secondary, marginTop: spacing[4] }, typography.body2]}>{subtitle}</Text>
          )}
        </View>

        {rightContent ? (
          rightContent
        ) : (
          rightIcon && (
            <Ionicons name={rightIcon} size={20} color={colors.text.secondary} />
          )
        )}
      </TouchableOpacity>
      {showDivider && (
        <View style={{ height: 1, backgroundColor: colors.border, marginLeft: icon ? spacing[56] : spacing[16] }} />
      )}
    </View>
  );
});

SphereListItem.displayName = 'SphereListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
});
