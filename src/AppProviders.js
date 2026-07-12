import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './context/ThemeContext';
import { VaultProvider } from './context/VaultContext';
import { NotificationProvider } from './context/NotificationContext';
import RootNavigator from './navigation/RootNavigator';
import { navigationRef } from './navigation/navigationRef';

export default function AppProviders() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <VaultProvider>
          <NotificationProvider>
            <NavigationContainer ref={navigationRef}>
              <RootNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </VaultProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
