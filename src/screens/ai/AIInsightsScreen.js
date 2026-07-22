import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Title, useTheme } from 'react-native-paper';

export default function AIInsightsScreen({ navigation }) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="AI Insights" />
      </Appbar.Header>
      <View style={styles.content}>
        <Title>Proactive Recommendations</Title>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { padding: 16 } });
