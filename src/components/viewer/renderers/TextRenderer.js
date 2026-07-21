import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../../hooks/useTheme';

const TextRenderer = ({ uri, initialScrollPosition = 0, onScrollPositionChange }) => {
  const { colors, typography } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preference for font size could be passed as prop later
  const fontSize = 16;

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        // Reading full text file. For extremely large files, this might need chunking.
        const text = await FileSystem.readAsStringAsync(uri);
        setContent(text);
      } catch (e) {
        setError('Failed to load text file.');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [uri]);

  const handleScroll = (event) => {
    if (onScrollPositionChange) {
      onScrollPositionChange(event.nativeEvent.contentOffset.y);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[typography.body, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      onScroll={handleScroll}
      scrollEventThrottle={100}
      contentOffset={{ x: 0, y: initialScrollPosition }}
    >
      <Text style={[typography.body, { color: colors.text, fontSize, lineHeight: fontSize * 1.5 }]}>
        {content}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextRenderer;
