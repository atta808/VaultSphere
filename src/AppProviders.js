import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { VaultProvider } from './context/VaultContext';
import { NotificationProvider } from './context/NotificationContext';
import RootNavigator from './navigation/RootNavigator';
import { navigationRef } from './navigation/navigationRef';
import { fonts } from './constants/fonts';

const MainApp = () => {
  const { isDark, colors } = React.useContext(ThemeContext);

  const paperTheme = isDark ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: colors.primary, background: colors.background, surface: colors.surface } } : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: colors.primary, background: colors.background, surface: colors.surface } };

  const navigationTheme = isDark ? {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
    },
  } : {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text.primary,
      border: colors.border,
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={paperTheme}>
          <VaultProvider>
            <NotificationProvider>
              <NavigationContainer ref={navigationRef} theme={navigationTheme}>
                <RootNavigator />
              </NavigationContainer>
            </NotificationProvider>
          </VaultProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default function AppProviders() {
  const [fontsLoaded] = useFonts({
    [fonts.montserrat.regular]: require('../assets/fonts/Montserrat-Regular.ttf'),
    [fonts.montserrat.medium]: require('../assets/fonts/Montserrat-Medium.ttf'),
    [fonts.montserrat.semiBold]: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    [fonts.montserrat.bold]: require('../assets/fonts/Montserrat-Bold.ttf'),
    [fonts.poppins.regular]: require('../assets/fonts/Poppins-Regular.ttf'),
    [fonts.poppins.medium]: require('../assets/fonts/Poppins-Medium.ttf'),
    [fonts.poppins.semiBold]: require('../assets/fonts/Poppins-SemiBold.ttf'),
    [fonts.poppins.bold]: require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
