import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const SearchInDocumentBar = ({ onClose, onSearch, currentMatch, totalMatches, onNext, onPrev }) => {
  const { colors, typography } = useTheme();
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="Find in document..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={handleSearch}
        autoFocus
      />

      {totalMatches > 0 && (
        <Text style={[typography.caption, { color: colors.textSecondary, marginRight: 8 }]}>
          {currentMatch} / {totalMatches}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={onPrev} disabled={totalMatches === 0}>
          <MaterialCommunityIcons name="chevron-up" size={24} color={totalMatches === 0 ? colors.border : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onNext} disabled={totalMatches === 0}>
          <MaterialCommunityIcons name="chevron-down" size={24} color={totalMatches === 0 ? colors.border : colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    elevation: 4,
    zIndex: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
  }
});

export default SearchInDocumentBar;
