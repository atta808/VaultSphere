import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightPalette, darkPalette, spacing, radius, typography, elevation, shadows } from '../theme';

const THEME_STORAGE_KEY = '@vaultsphere_theme_preference';

export const ThemeContext = createContext({
  theme: 'system',
  isDark: false,
  colors: lightPalette,
  spacing,
  radius,
  typography,
  elevation,
  shadows,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState('system'); // 'light', 'dark', or 'system'
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemePreference(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (newTheme) => {
    try {
      setThemePreference(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const currentIsDark = themePreference === 'system' ? systemColorScheme === 'dark' : themePreference === 'dark';
    setTheme(currentIsDark ? 'light' : 'dark');
  }, [themePreference, systemColorScheme, setTheme]);

  const isDark = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark';
    }
    return themePreference === 'dark';
  }, [themePreference, systemColorScheme]);

  const colors = isDark ? darkPalette : lightPalette;

  const contextValue = useMemo(() => ({
    theme: themePreference,
    isDark,
    colors,
    spacing,
    radius,
    typography,
    elevation,
    shadows,
    setTheme,
    toggleTheme,
  }), [themePreference, isDark, colors, setTheme, toggleTheme]);

  if (!isReady) {
    return null; // Or a very minimal splash screen
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
