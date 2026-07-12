import React, { memo } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export const ScreenContainer = memo(({
  children,
  scrollable = false,
  padding = true,
  keyboardAware = true,
  style,
  contentContainerStyle,
  testID,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    padding && { paddingHorizontal: spacing[16] },
    style,
  ];

  const contentStyle = [
    {
      paddingTop: insets.top + (padding ? spacing[16] : 0),
      paddingBottom: insets.bottom + (padding ? spacing[16] : 0),
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    contentContainerStyle,
  ];

  let content = (
    <View style={containerStyle} testID={testID}>
      {children}
    </View>
  );

  if (scrollable) {
    content = (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        testID={testID}
      >
        {children}
      </ScrollView>
    );
  } else {
    // If not scrollable, apply safe area padding to the view itself
    content = (
      <View style={[containerStyle, contentStyle]} testID={testID}>
        {children}
      </View>
    );
  }

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
});

ScreenContainer.displayName = 'ScreenContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
});
