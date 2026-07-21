import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CollaborationStack from './CollaborationStack';
import WorkflowStack from './WorkflowStack';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
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
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name={ROUTES.COLLABORATION_STACK} component={CollaborationStack} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.WORKFLOW_STACK} component={WorkflowStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
