import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const AnnotationPanel = ({ annotations, onClose, onSelectAnnotation, onAddAnnotation }) => {
  const { colors, typography } = useTheme();

  const renderItem = ({ item }) => {
    let iconName = 'note-text-outline';
    if (item.type === 'highlight') iconName = 'format-color-highlight';
    else if (item.type === 'underline') iconName = 'format-underline';
    else if (item.type === 'strike-through') iconName = 'format-strikethrough-variant';
    else if (item.type === 'freehand' || item.type === 'drawing') iconName = 'draw';
    else if (item.type === 'rectangle') iconName = 'shape-rectangle-plus';
    else if (item.type === 'circle') iconName = 'shape-circle-plus';

    return (
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: colors.border }]}
        onPress={() => onSelectAnnotation(item)}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={colors.primary}
        />
        <View style={styles.itemContent}>
          <Text style={[typography.body, { color: colors.text }]} numberOfLines={1}>
            {item.content || `${item.type} on page ${item.pageNumber}`}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Page {item.pageNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderLeftColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[typography.h3, { color: colors.text }]}>Annotations</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={annotations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>No annotations yet.</Text>
          </View>
        }
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => onAddAnnotation('highlight')}>
          <MaterialCommunityIcons name="format-color-highlight" size={20} color={colors.surface} />
          <Text style={[typography.button, { color: colors.surface, marginLeft: 8 }]}>Add New</Text>
        </TouchableOpacity>
      </View>
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  }
});

export default AnnotationPanel;
