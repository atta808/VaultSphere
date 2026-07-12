import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const SectionTitle = memo(({
  title,
  subtitle,
  rightAction,
  style,
  titleStyle,
  subtitleStyle,
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing[16] }, style]} testID={testID}>
      <View style={styles.textContainer}>
        <Text style={[typography.h3, { color: colors.text.primary }, titleStyle]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing[4] }, subtitleStyle]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightAction && (
        <View style={styles.actionContainer}>
          {rightAction}
        </View>
      )}
    </View>
  );
});

SectionTitle.displayName = 'SectionTitle';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flex: 1,
  },
  actionContainer: {
    marginLeft: 16,
  },
});
