import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const UnsupportedRenderer = ({ fileName, mimeType }) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MaterialCommunityIcons name="file-alert-outline" size={80} color={colors.textSecondary} />
      <Text style={[typography.h3, { color: colors.text, marginTop: 16, textAlign: 'center' }]}>
        Unsupported File Format
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 32 }]}>
        We cannot preview this file type natively yet.
      </Text>

      <View style={[styles.metaContainer, { backgroundColor: colors.surface }]}>
        <Text style={[typography.caption, { color: colors.text }]}>File: {fileName || 'Unknown'}</Text>
        <Text style={[typography.caption, { color: colors.text }]}>Type: {mimeType || 'Unknown'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  }
});

export default UnsupportedRenderer;
