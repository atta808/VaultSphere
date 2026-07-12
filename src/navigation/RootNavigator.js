import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
