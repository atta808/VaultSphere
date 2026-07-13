import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreatePinScreen } from '../screens/security/CreatePinScreen';
import { ConfirmPinScreen } from '../screens/security/ConfirmPinScreen';
import { VerifyPinScreen } from '../screens/security/VerifyPinScreen';
import { ChangePinScreen } from '../screens/security/ChangePinScreen';
import { LockScreen } from '../screens/security/LockScreen';
import { ROUTES } from '../config/routes';

const Stack = createNativeStackNavigator();

export const SecurityStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name={ROUTES.LOCK_SCREEN} component={LockScreen} />
      <Stack.Screen name={ROUTES.CREATE_PIN} component={CreatePinScreen} />
      <Stack.Screen name={ROUTES.CONFIRM_PIN} component={ConfirmPinScreen} />
      <Stack.Screen name={ROUTES.VERIFY_PIN} component={VerifyPinScreen} />
      <Stack.Screen name={ROUTES.CHANGE_PIN} component={ChangePinScreen} />
    </Stack.Navigator>
  );
};
