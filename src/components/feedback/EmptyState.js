import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { PremiumButton } from '../buttons/PremiumButton';

export const EmptyState = memo(({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
  style,
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing[24] }, style]} testID={testID}>
      {icon && (
        <View style={[styles.iconContainer, { marginBottom: spacing[16] }]}>
          {icon}
        </View>
      )}
      {title && (
        <Text style={[typography.h3, { color: colors.text.primary, textAlign: 'center', marginBottom: spacing[8] }]}>
          {title}
        </Text>
      )}
      {description && (
        <Text style={[typography.body, { color: colors.text.secondary, textAlign: 'center', marginBottom: spacing[24] }]}>
          {description}
        </Text>
      )}
      {actionLabel && onActionPress && (
        <PremiumButton
          onPress={onActionPress}
          variant="primary"
          fullWidth={false}
        >
          {actionLabel}
        </PremiumButton>
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
