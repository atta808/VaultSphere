import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PremiumIconButton } from '../buttons/PremiumIconButton';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

export const PremiumPageHeader = memo(({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  actions,
  safeArea = true,
  style,
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        safeArea && { paddingTop: insets.top },
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing[16],
          paddingBottom: spacing[12],
        },
        style
      ]}
      testID={testID}
    >
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <PremiumIconButton
              icon="arrow-left"
              size={24}
              onPress={handleBack}
              style={{ marginRight: spacing[8] }}
              accessibilityLabel="Go back"
            />
          )}
          <View style={styles.titleContainer}>
            {title && (
              <Text
                style={[typography.h2, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[typography.body, { color: colors.text.secondary, marginTop: 2 }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {actions && (
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        )}
      </View>
    </View>
  );
});

PremiumPageHeader.displayName = 'PremiumPageHeader';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
});
