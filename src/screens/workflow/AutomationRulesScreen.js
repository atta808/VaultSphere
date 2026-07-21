import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Surface, TextInput, Dialog, Portal } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

export default function AutomationRulesScreen() {
  const { colors, typography, spacing } = useTheme();
  const [rules, setRules] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', eventType: '', conditions: '', actions: '' });

  const handleCreate = () => {
    setRules([...rules, { ...newRule, id: Date.now() }]);
    setVisible(false);
    setNewRule({ name: '', eventType: '', conditions: '', actions: '' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.md }]}>Automation Rules</Text>
        <Button mode="contained" onPress={() => setVisible(true)} style={{ marginBottom: spacing.lg }}>
          Create Rule
        </Button>

        {rules.map(rule => (
          <Surface key={rule.id} style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
            <Text style={[typography.h4, { color: colors.text.primary }]}>{rule.name}</Text>
            <Text style={[typography.body2, { color: colors.text.secondary }]}>Event: {rule.eventType}</Text>
            <Text style={[typography.body2, { color: colors.text.secondary }]}>Condition: {rule.conditions}</Text>
            <Text style={[typography.body2, { color: colors.text.secondary }]}>Action: {rule.actions}</Text>
            <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
               <Button mode="text" onPress={() => {}}>Edit</Button>
               <Button mode="text" onPress={() => {}}>Delete</Button>
            </View>
          </Surface>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>New Automation Rule</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Rule Name"
              value={newRule.name}
              onChangeText={text => setNewRule(prev => ({ ...prev, name: text }))}
              style={{ marginBottom: spacing.sm }}
            />
            <TextInput
              label="Event (e.g. document_uploaded)"
              value={newRule.eventType}
              onChangeText={text => setNewRule(prev => ({ ...prev, eventType: text }))}
              style={{ marginBottom: spacing.sm }}
            />
            <TextInput
              label="Condition"
              value={newRule.conditions}
              onChangeText={text => setNewRule(prev => ({ ...prev, conditions: text }))}
              style={{ marginBottom: spacing.sm }}
            />
            <TextInput
              label="Action"
              value={newRule.actions}
              onChangeText={text => setNewRule(prev => ({ ...prev, actions: text }))}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleCreate}>Create</Button>
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
