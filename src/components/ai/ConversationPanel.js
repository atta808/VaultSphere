import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import MessageBubble from './MessageBubble';
import { useTheme } from '../../hooks/useTheme';

export default function ConversationPanel({ messages }) {
  const { spacing } = useTheme();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollViewRef.current) {
        setTimeout(() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }, 100);
    }
  }, [messages]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={{ padding: spacing.md }}
    >
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
