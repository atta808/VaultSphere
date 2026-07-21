import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const AnnotationToolbar = ({ activeTool, onSelectTool, selectedColor, onSelectColor }) => {
  const { colors } = useTheme();

  const tools = [
    { id: 'highlight', icon: 'format-color-highlight' },
    { id: 'underline', icon: 'format-underline' },
    { id: 'strike-through', icon: 'format-strikethrough-variant' },
    { id: 'freehand', icon: 'draw' },
    { id: 'note', icon: 'note-text-outline' },
    { id: 'rectangle', icon: 'shape-rectangle-plus' },
    { id: 'circle', icon: 'shape-circle-plus' }
  ];

  const colorOptions = ['#ffeb3b', '#f44336', '#4caf50', '#2196f3', '#9c27b0'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={styles.toolRow}>
        {tools.map(tool => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolButton, activeTool === tool.id && { backgroundColor: colors.primaryContainer }]}
            onPress={() => onSelectTool(tool.id)}
          >
            <MaterialCommunityIcons
              name={tool.icon}
              size={24}
              color={activeTool === tool.id ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Color picker for specific tools */}
      {['highlight', 'freehand', 'rectangle', 'circle', 'underline', 'strike-through'].includes(activeTool) && (
        <View style={styles.colorRow}>
          {colorOptions.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                selectedColor === color && styles.colorDotSelected,
                selectedColor === color && { borderColor: colors.primary }
              ]}
              onPress={() => onSelectColor(color)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 8,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolButton: {
    padding: 8,
    borderRadius: 8,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    transform: [{ scale: 1.2 }],
  }
});

export default AnnotationToolbar;
