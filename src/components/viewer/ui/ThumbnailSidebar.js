import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const ThumbnailSidebar = ({ thumbnails, currentPage, onSelectPage, onClose }) => {
  const { colors, typography } = useTheme();

  const renderItem = ({ item }) => {
    const isActive = item.pageNumber === currentPage;
    return (
      <TouchableOpacity
        style={[
          styles.item,
          isActive && { borderColor: colors.primary, borderWidth: 2 }
        ]}
        onPress={() => onSelectPage(item.pageNumber)}
      >
        {item.uri ? (
          <Image source={{ uri: item.uri }} style={styles.thumbnail} contentFit="cover" />
        ) : (
          <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.border }]}>
             <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.textSecondary} />
          </View>
        )}
        <Text style={[typography.caption, { color: isActive ? colors.primary : colors.text, marginTop: 4 }]}>
          {item.pageNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[typography.h4, { color: colors.text }]}>Pages</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={thumbnails}
        keyExtractor={item => item.pageNumber.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 56, // below toolbar
    bottom: 0,
    width: 120,
    borderRightWidth: 1,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    borderRadius: 4,
    padding: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ThumbnailSidebar;
