import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const PremiumBadge = memo(({
  label,
  variant = 'neutral', // primary, warning, danger, success, neutral
  style,
  labelStyle,
  testID,
}) => {
  const { colors, typography, radius, spacing } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: colors.text.inverse };
      case 'warning':
        return { bg: colors.warning, text: colors.text.inverse };
      case 'danger':
        return { bg: colors.danger, text: colors.text.inverse };
      case 'success':
        return { bg: colors.success, text: colors.text.inverse };
      case 'neutral':
      default:
        return { bg: colors.border, text: colors.text.primary };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing[8],
          paddingVertical: spacing[2],
        },
        style
      ]}
      testID={testID}
    >
      <Text
        style={[
          typography.caption,
          { color: variantStyle.text, fontWeight: '600' },
          labelStyle
        ]}
      >
        {label}
      </Text>
    </View>
  );
});

PremiumBadge.displayName = 'PremiumBadge';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
