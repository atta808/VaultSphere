import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import AIWorkspaceScreen from '../screens/ai/AIWorkspaceScreen';
import ComparisonScreen from '../screens/ai/ComparisonScreen';

const Stack = createNativeStackNavigator();

export default function AIWorkspaceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.AI_WORKSPACE} component={AIWorkspaceScreen} />
      <Stack.Screen name={ROUTES.COMPARISON_SCREEN} component={ComparisonScreen} />
    </Stack.Navigator>
  );
}
