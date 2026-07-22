import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, Dialog, Portal } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import DigitalSignatureService from '../../services/workflow/DigitalSignatureService';

export default function SignatureManagerScreen({ route }) {
  const { colors, typography, spacing } = useTheme();
  const [visible, setVisible] = useState(false);
  const [pin, setPin] = useState('');

  const { documentId } = route.params || { documentId: 1 }; // Fallback for dev

  const handleSign = async () => {
    try {
        await DigitalSignatureService.applySignature(
            documentId,
            "mocked_document_content",
            { id: 'user1', name: 'Current User' },
            pin
        );
        Alert.alert('Success', 'Document signed successfully.');
        setVisible(false);
    } catch (error) {
        Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.md }]}>Signature Manager</Text>
        <Button mode="contained" onPress={() => setVisible(true)} style={{ marginBottom: spacing.lg }}>
          Sign Document
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Enter Vault PIN to Sign</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Vault PIN"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              style={{ marginBottom: spacing.sm }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleSign}>Sign</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  }
});
