import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { ROUTES } from '../config/routes';
import HomeStack from './HomeStack';
import VaultStack from './VaultStack';
import SearchStack from './SearchStack';
import AIWorkspaceStack from './AIWorkspaceStack';
import SettingsStack from './SettingsStack';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { colors, typography } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: typography.caption,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_STACK}
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name={ROUTES.VAULT_STACK}
        component={VaultStack}
        options={{
          tabBarLabel: 'Vault',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="safe-square" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name={ROUTES.SEARCH_STACK}
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name={ROUTES.AI_WORKSPACE_STACK}
        component={AIWorkspaceStack}
        options={{
          tabBarLabel: 'Workspace',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="auto-fix" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS_STACK}
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
