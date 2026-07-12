import React, { memo, forwardRef } from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

export const PremiumIconButton = memo(forwardRef(({
  icon,
  variant = 'ghost', // filled, outlined, ghost
  circular = true,
  size = 24,
  disabled = false,
  style,
  testID,
  ...rest
}, ref) => {
  const { colors, radius } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          mode: 'contained',
          containerColor: colors.primary,
          iconColor: colors.text.inverse,
        };
      case 'outlined':
        return {
          mode: 'outlined',
          containerColor: 'transparent',
          iconColor: colors.primary,
          borderColor: colors.border,
        };
      case 'ghost':
      default:
        return {
          mode: undefined, // Paper handles ghost as default without container
          containerColor: 'transparent',
          iconColor: colors.text.primary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <PaperIconButton
      ref={ref}
      icon={icon}
      size={size}
      mode={variantStyles.mode}
      containerColor={variantStyles.containerColor}
      iconColor={variantStyles.iconColor}
      disabled={disabled}
      style={[
        circular ? { borderRadius: radius.circle } : { borderRadius: radius.md },
        variant === 'outlined' && { borderColor: variantStyles.borderColor, borderWidth: 1 },
        style
      ]}
      testID={testID}
      {...rest}
    />
  );
}));

PremiumIconButton.displayName = 'PremiumIconButton';
