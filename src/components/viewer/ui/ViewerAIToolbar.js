import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

const ViewerAIToolbar = ({ onAction }) => {
  const { colors, typography } = useTheme();

  const actions = [
    { id: 'ask', icon: 'chat-question', label: 'Ask AI' },
    { id: 'summarize', icon: 'text-short', label: 'Summarize' },
    { id: 'analyze', icon: 'brain', label: 'Analyze' },
    { id: 'search', icon: 'file-search', label: 'Search AI' },
    { id: 'compare', icon: 'file-compare', label: 'Compare' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionBtn, { backgroundColor: colors.background }]}
            onPress={() => onAction(action.id)}
          >
            <MaterialCommunityIcons name={action.icon} size={20} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.text, marginLeft: 6 }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 56, // above page controls or standard toolbar
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 8,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent', // can use primary with opacity
  }
});

export default ViewerAIToolbar;
