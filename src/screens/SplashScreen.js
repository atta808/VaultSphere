import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();

  useEffect(() => {
    // Navigate to Main Tabs after a short delay
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.MAIN_TABS);
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[{ color: colors.surface }, typography.h1]}>VaultSphere</Text>
      <Text style={[{ color: colors.surface, marginTop: spacing[8] }, typography.body1]}>Secure Everything</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
