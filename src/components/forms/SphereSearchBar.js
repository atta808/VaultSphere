import React, { memo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SphereSearchBar = memo(({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
}) => {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radius.lg,
        paddingHorizontal: spacing[16],
        height: 48,
      },
      style
    ]}>
      <Ionicons name="search" size={20} color={colors.text.secondary} />
      <TextInput
        style={[
          styles.input,
          { color: colors.text.primary },
          typography.body1,
          { marginLeft: spacing[12] }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

SphereSearchBar.displayName = 'SphereSearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
});
