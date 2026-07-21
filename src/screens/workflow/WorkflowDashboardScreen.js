import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../config/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WorkflowDashboardScreen({ navigation }) {
  const { colors, typography, spacing } = useTheme();

  const renderCard = (title, icon, route, description) => (
    <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
      <View style={styles.cardHeader}>
        <Icon name={icon} size={24} color={colors.primary} />
        <Text style={[typography.h4, { color: colors.text.primary, marginLeft: spacing.sm }]}>{title}</Text>
      </View>
      <Text style={[typography.body2, { color: colors.text.secondary, marginBottom: spacing.md }]}>{description}</Text>
      <Button mode="contained" onPress={() => navigation.navigate(route)}>Open</Button>
    </Surface>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.grid}>
        {renderCard('Templates', 'file-document-outline', ROUTES.WORKFLOW_TEMPLATES, 'Manage reusable workflow templates.')}
        {renderCard('Approvals', 'check-decagram', ROUTES.APPROVAL_INBOX, 'View your pending approval requests.')}
        {renderCard('My Tasks', 'format-list-checks', ROUTES.MY_TASKS, 'Manage tasks assigned to you.')}
        {renderCard('History', 'history', ROUTES.WORKFLOW_HISTORY, 'View past workflows and their status.')}
        {renderCard('Signatures', 'draw-pen', ROUTES.SIGNATURE_MANAGER, 'Manage digital signatures.')}
        {renderCard('Automation', 'robot', ROUTES.AUTOMATION_RULES, 'Configure automated workflow rules.')}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  }
});
