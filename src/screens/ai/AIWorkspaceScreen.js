import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import ConversationPanel from '../../components/ai/ConversationPanel';
import PromptInput from '../../components/ai/PromptInput';
import AIAssistantService from '../../ai/services/AIAssistantService';
import ConversationService from '../../ai/services/ConversationService';

export default function AIWorkspaceScreen({ route }) {
  const { colors, typography, spacing, radius } = useTheme();
  const contextDocumentId = route?.params?.contextDocumentId;

  const [messages, setMessages] = useState([
      { role: 'assistant', content: contextDocumentId
          ? 'Hello! I am ready to answer questions about this document.'
          : 'Hello! I am your AI Workspace Assistant. How can I help you today?' }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [documentContextText, setDocumentContextText] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
     if (contextDocumentId) {
         // Load document OCR text to be used as context
         const loadContext = async () => {
             try {
                // We'll mock loading the OCR text directly for now.
                // In a full implementation, we'd pull from OCRResultRepository.
                setDocumentContextText('This is the content of the contextual document. It contains dates and names.');
             } catch(e) {
                 console.error(e);
             }
         };
         loadContext();
     }
  }, [contextDocumentId]);

  const initConversation = async () => {
      if (conversationId) return conversationId;
      const title = contextDocumentId ? 'Document Analysis' : 'Workspace Chat';
      const conv = await ConversationService.createConversation(title, 'gemini', 'gemini-1.5-flash', contextDocumentId ? [contextDocumentId] : []);
      setConversationId(conv.id);
      return conv.id;
  };

  const handleSend = async (text) => {
      setIsStreaming(true);
      const userMsg = { role: 'user', content: text };
      setMessages(prev => [...prev, userMsg]);

      const cid = await initConversation();

      abortControllerRef.current = new AbortController();

      try {
          const stream = AIAssistantService.chatStream(cid, text, documentContextText, []);

          let assistantMsg = { role: 'assistant', content: '' };
          setMessages(prev => [...prev, assistantMsg]);

          for await (const chunk of stream) {
              if (abortControllerRef.current?.signal.aborted) {
                  break;
              }
              setMessages(prev => {
                  const newMsgs = [...prev];
                  const last = newMsgs[newMsgs.length - 1];
                  last.content = chunk.text;
                  if (chunk.citations) last.citations = chunk.citations;
                  return newMsgs;
              });
          }
      } catch (error) {
          if (error.name !== 'AbortError') {
              setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
          }
      } finally {
          setIsStreaming(false);
          abortControllerRef.current = null;
      }
  };

  const handleCancel = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setIsStreaming(false);
      }
  };

  const quickActions = ['Summarize a concept', 'Compare documents', 'Extract entities from text'];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
         <Text style={[typography.h2, { color: colors.text.primary }]}>AI Workspace</Text>
      </View>

      <ConversationPanel messages={messages} />

      {messages.length === 1 && (
        <View style={styles.quickActionsContainer}>
           {quickActions.map((action, i) => (
             <TouchableOpacity key={i} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]} onPress={() => handleSend(action)}>
                <Text style={[typography.body2, { color: colors.primary }]}>{action}</Text>
             </TouchableOpacity>
           ))}
        </View>
      )}

      <PromptInput
        onSubmit={handleSend}
        isStreaming={isStreaming}
        onCancel={handleCancel}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'center'
  },
  quickAction: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
  }
});
