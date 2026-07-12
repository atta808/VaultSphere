import React, { memo, forwardRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const PremiumCard = memo(forwardRef(({
  header,
  body,
  footer,
  children,
  onPress,
  shadow = true,
  border = false,
  rounded = true,
  variant = 'surface', // surface, primary, secondary
  style,
  contentStyle,
  testID,
  ...rest
}, ref) => {
  const { colors, radius, elevation, shadows, spacing } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'surface':
      default:
        return { backgroundColor: colors.surface };
    }
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      ref={ref}
      onPress={onPress}
      style={[
        styles.container,
        getVariantStyles(),
        rounded && { borderRadius: radius.lg },
        border && { borderWidth: 1, borderColor: colors.border },
        shadow && shadows.md,
        shadow && elevation[2],
        style,
      ]}
      testID={testID}
      {...rest}
    >
      <View style={[styles.content, { padding: spacing[16] }, contentStyle]}>
        {header && <View style={[styles.header, { marginBottom: spacing[12] }]}>{header}</View>}
        {body && <View style={styles.body}>{body}</View>}
        {children && <View style={styles.body}>{children}</View>}
        {footer && <View style={[styles.footer, { marginTop: spacing[16] }]}>{footer}</View>}
      </View>
    </Container>
  );
}));

PremiumCard.displayName = 'PremiumCard';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  header: {},
  body: {},
  footer: {},
});
