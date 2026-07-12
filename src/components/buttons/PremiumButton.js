import React, { memo, forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

export const PremiumButton = memo(forwardRef(({
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'large', // small, medium, large
  iconLeft,
  iconRight,
  fullWidth = true,
  loading = false,
  disabled = false,
  style,
  contentStyle,
  labelStyle,
  children,
  testID,
  ...rest
}, ref) => {
  const { colors, typography, radius, spacing } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          mode: 'contained',
          buttonColor: colors.secondary,
          textColor: colors.text.inverse,
        };
      case 'outline':
        return {
          mode: 'outlined',
          buttonColor: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          mode: 'text',
          buttonColor: 'transparent',
          textColor: colors.primary,
        };
      case 'danger':
        return {
          mode: 'contained',
          buttonColor: colors.danger,
          textColor: colors.text.inverse,
        };
      case 'primary':
      default:
        return {
          mode: 'contained',
          buttonColor: colors.primary,
          textColor: colors.text.inverse,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[12],
          fontSize: typography.caption.fontSize,
        };
      case 'medium':
        return {
          paddingVertical: spacing[8],
          paddingHorizontal: spacing[16],
          fontSize: typography.button.fontSize,
        };
      case 'large':
      default:
        return {
          paddingVertical: spacing[12],
          paddingHorizontal: spacing[24],
          fontSize: typography.button.fontSize,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Handle icon placement
  let iconName = iconLeft || iconRight;
  let isIconRight = !!iconRight && !iconLeft;

  return (
    <View style={[fullWidth ? styles.fullWidth : styles.wrapContent, style]}>
      <PaperButton
        ref={ref}
        mode={variantStyles.mode}
        buttonColor={variantStyles.buttonColor}
        textColor={variantStyles.textColor}
        loading={loading}
        disabled={disabled}
        icon={iconName}
        contentStyle={[
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            flexDirection: isIconRight ? 'row-reverse' : 'row',
          },
          contentStyle
        ]}
        labelStyle={[
          typography.button,
          { fontSize: sizeStyles.fontSize },
          labelStyle
        ]}
        style={[
          { borderRadius: radius.md },
          variant === 'outline' && { borderColor: variantStyles.borderColor, borderWidth: 1 },
        ]}
        testID={testID}
        {...rest}
      >
        {children}
      </PaperButton>
    </View>
  );
}));

PremiumButton.displayName = 'PremiumButton';

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  wrapContent: {
    alignSelf: 'flex-start',
  },
});
