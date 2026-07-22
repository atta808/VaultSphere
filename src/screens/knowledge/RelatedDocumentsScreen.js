import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function RelatedDocumentsScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text>Related Documents View - Intended to be opened from Document Viewer</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
