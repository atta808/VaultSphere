import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const BookmarkPanel = ({ bookmarks, onClose, onSelectBookmark, onAddBookmark }) => {
  const { colors, typography } = useTheme();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddBookmark(newTitle.trim());
      setNewTitle('');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.border }]}
      onPress={() => onSelectBookmark(item)}
    >
      <MaterialCommunityIcons name="bookmark" size={20} color={colors.primary} />
      <View style={styles.itemContent}>
        <Text style={[typography.body, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Page {item.pageNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderLeftColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[typography.h3, { color: colors.text }]}>Bookmarks</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.addSection, { borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="New bookmark title"
          placeholderTextColor={colors.textSecondary}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: newTitle.trim() ? colors.primary : colors.border }]}
          onPress={handleAdd}
          disabled={!newTitle.trim()}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>No bookmarks yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 56, // below toolbar
    bottom: 0,
    width: 300,
    borderLeftWidth: 1,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSection: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemContent: {
    marginLeft: 12,
    flex: 1,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});

export default BookmarkPanel;
