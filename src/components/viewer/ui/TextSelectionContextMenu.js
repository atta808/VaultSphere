import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TextSelectionContextMenu = ({ visible, position, onAction, onClose }) => {
  const { colors, typography } = useTheme();

  if (!visible) return null;

  const actions = [
    { id: 'explain', icon: 'lightbulb-outline', label: 'Explain' },
    { id: 'summarize', icon: 'text-short', label: 'Summarize' },
    { id: 'translate', icon: 'translate', label: 'Translate' },
    { id: 'extract', icon: 'table-search', label: 'Extract Entities' },
    { id: 'compare', icon: 'file-compare', label: 'Compare' },
  ];

  return (
    <View style={[styles.container, { top: position.y, left: position.x, backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.actionsGrid}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionBtn}
            onPress={() => {
              onAction(action.id);
              onClose();
            }}
          >
            <MaterialCommunityIcons name={action.icon} size={20} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.text }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    elevation: 8,
    width: 280,
    zIndex: 1000,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)', // fallback
  }
});

export default TextSelectionContextMenu;
