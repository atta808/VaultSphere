import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import { SecurityStack } from './SecurityStack';
import { useAuthentication } from '../context/AuthenticationContext';
import { LockScreen } from '../screens/security/LockScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLocked, isInitializing } = useAuthentication();

  if (isInitializing) {
    return null; // Let SplashScreen handle the UI
  }

  // If application is globally locked, only show the LockScreen
  if (isLocked) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
         <Stack.Screen name={ROUTES.LOCK_SCREEN} component={LockScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.SECURITY_STACK} component={SecurityStack} />
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
