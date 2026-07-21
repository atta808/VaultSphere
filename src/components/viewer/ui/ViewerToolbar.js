import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const ViewerToolbar = ({
  onClose,
  title,
  onToggleBookmarks,
  onToggleAnnotations,
  onToggleThumbnails,
  onSearch,
  onAIWorkspace,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Optional Title can go here, but usually icons take precedence in viewers */}
      <View style={styles.rightGroup}>
        {onAIWorkspace && (
          <TouchableOpacity style={styles.iconButton} onPress={onAIWorkspace}>
            <MaterialCommunityIcons name="auto-fix" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={onSearch}>
          <MaterialCommunityIcons name="magnify" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleThumbnails}>
          <MaterialCommunityIcons name="view-grid-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleBookmarks}>
          <MaterialCommunityIcons name="bookmark-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onToggleAnnotations}>
          <MaterialCommunityIcons name="draw" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewerToolbar;
