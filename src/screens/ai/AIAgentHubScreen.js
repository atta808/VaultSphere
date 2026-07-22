import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';
import { ROUTES } from '../../config/routes';

export default function AIAgentHubScreen({ navigation }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="AI Agent Hub" />
      </Appbar.Header>

      <List.Section>
        <List.Item
          title="Agent Manager"
          description="Configure built-in and custom AI Agents"
          left={props => <List.Icon {...props} icon="robot" />}
          onPress={() => navigation.navigate(ROUTES.AGENT_MANAGER)}
        />
        <List.Item
          title="Automation Hub"
          description="Set up event-driven tasks and workflows"
          left={props => <List.Icon {...props} icon="cog-transfer" />}
          onPress={() => navigation.navigate(ROUTES.AUTOMATION_HUB)}
        />
        <List.Item
          title="Scheduled Jobs"
          description="Manage background and recurring tasks"
          left={props => <List.Icon {...props} icon="calendar-clock" />}
          onPress={() => navigation.navigate(ROUTES.SCHEDULED_JOBS)}
        />
        <List.Item
          title="Pending Approvals"
          description="Review sensitive agent actions"
          left={props => <List.Icon {...props} icon="check-decagram" />}
          onPress={() => navigation.navigate(ROUTES.PENDING_APPROVALS)}
        />
        <List.Item
          title="Execution History"
          description="Audit trail of all agent and tool runs"
          left={props => <List.Icon {...props} icon="history" />}
          onPress={() => navigation.navigate(ROUTES.EXECUTION_HISTORY)}
        />
        <List.Item
          title="AI Insights"
          description="Proactive recommendations and alerts"
          left={props => <List.Icon {...props} icon="lightbulb-on" />}
          onPress={() => navigation.navigate(ROUTES.AI_INSIGHTS)}
        />
        <List.Item
          title="Prompt Library"
          description="Manage templates for agents"
          left={props => <List.Icon {...props} icon="text-box-outline" />}
          onPress={() => navigation.navigate(ROUTES.PROMPT_LIBRARY)}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
