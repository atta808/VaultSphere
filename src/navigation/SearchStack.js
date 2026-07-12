import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import SearchScreen from '../screens/SearchScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  const { colors, typography } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text.primary,
        headerTitleStyle: typography.h3,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
