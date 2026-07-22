import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Surface, TextInput, Dialog, Portal } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import WorkflowTemplateService from '../../services/workflow/WorkflowTemplateService';

export default function WorkflowTemplatesScreen() {
  const { colors, typography, spacing } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '' });

  const loadTemplates = async () => {
    const data = await WorkflowTemplateService.getTemplates();
    setTemplates(data);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await WorkflowTemplateService.getTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const handleCreate = async () => {
    if (!newTemplate.name) return;
    await WorkflowTemplateService.createTemplate(newTemplate, { id: 'current-user-id' }); // Mock user
    setVisible(false);
    setNewTemplate({ name: '', description: '' });
    loadTemplates();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.text.primary, marginBottom: spacing.md }]}>Workflow Templates</Text>
        <Button mode="contained" onPress={() => setVisible(true)} style={{ marginBottom: spacing.lg }}>
          Create Template
        </Button>

        {templates.map(template => (
          <Surface key={template.id} style={[styles.card, { backgroundColor: colors.surface }]} elevation={1}>
            <Text style={[typography.h4, { color: colors.text.primary }]}>{template.name}</Text>
            <Text style={[typography.body2, { color: colors.text.secondary }]}>{template.description}</Text>
            <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
               <Button mode="text" onPress={() => {}}>Edit</Button>
               <Button mode="text" onPress={() => {}}>Duplicate</Button>
               <Button mode="text" onPress={() => {}}>Delete</Button>
            </View>
          </Surface>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>New Template</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={newTemplate.name}
              onChangeText={text => setNewTemplate(prev => ({ ...prev, name: text }))}
              style={{ marginBottom: spacing.sm }}
            />
            <TextInput
              label="Description"
              value={newTemplate.description}
              onChangeText={text => setNewTemplate(prev => ({ ...prev, description: text }))}
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
