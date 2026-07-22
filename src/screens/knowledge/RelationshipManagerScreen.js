import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function RelationshipManagerScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text>Relationship Manager - Review AI detected relationships & add manual ones.</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
