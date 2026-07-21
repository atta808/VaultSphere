import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export default function PromptInput({ onSubmit, isStreaming, onCancel }) {
  const { colors, typography, spacing, radius } = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isStreaming) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, padding: spacing.sm, borderTopColor: colors.border }]}>
      <TextInput
        style={[styles.input, { color: colors.text.primary, backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.sm }]}
        value={text}
        onChangeText={setText}
        placeholder="Ask the AI Assistant..."
        placeholderTextColor={colors.text.secondary}
        multiline
      />

      {isStreaming ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.error, borderRadius: radius.full }]} onPress={onCancel}>
          <Ionicons name="stop" size={24} color={colors.background} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, borderRadius: radius.full }]} onPress={handleSend}>
          <Ionicons name="send" size={24} color={colors.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    marginRight: 8,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
