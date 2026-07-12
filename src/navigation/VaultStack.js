import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import VaultScreen from '../screens/VaultScreen';
import DocumentDetailsScreen from '../screens/DocumentDetailsScreen';
import AddDocumentScreen from '../screens/AddDocumentScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export default function VaultStack() {
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
      <Stack.Screen name={ROUTES.VAULT} component={VaultScreen} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.DOCUMENT_DETAILS} component={DocumentDetailsScreen} options={{ title: 'Document Details' }} />
      <Stack.Screen name={ROUTES.ADD_DOCUMENT} component={AddDocumentScreen} options={{ title: 'Add Document' }} />
    </Stack.Navigator>
  );
}
