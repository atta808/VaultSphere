import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
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
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} options={{ title: 'Favorites' }} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
}
