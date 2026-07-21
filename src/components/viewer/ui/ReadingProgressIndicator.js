import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

const ReadingProgressIndicator = ({ currentPage, totalPages }) => {
  const { colors, typography } = useTheme();

  if (!totalPages || totalPages <= 1) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[typography.caption, { color: colors.text }]}>
        {currentPage} / {totalPages}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    opacity: 0.8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ReadingProgressIndicator;
