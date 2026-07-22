import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import { useTheme } from '../hooks/useTheme';

import WorkflowDashboardScreen from '../screens/workflow/WorkflowDashboardScreen';
import WorkflowTemplatesScreen from '../screens/workflow/WorkflowTemplatesScreen';
import ApprovalInboxScreen from '../screens/workflow/ApprovalInboxScreen';
import MyTasksScreen from '../screens/workflow/MyTasksScreen';
import TaskDetailsScreen from '../screens/workflow/TaskDetailsScreen';
import WorkflowHistoryScreen from '../screens/workflow/WorkflowHistoryScreen';
import SignatureManagerScreen from '../screens/workflow/SignatureManagerScreen';
import AutomationRulesScreen from '../screens/workflow/AutomationRulesScreen';

const Stack = createNativeStackNavigator();

export default function WorkflowStack() {
  const { colors, typography } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text.primary,
        headerTitleStyle: typography.h3,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name={ROUTES.WORKFLOW_DASHBOARD} component={WorkflowDashboardScreen} options={{ title: 'Workflow Dashboard' }} />
      <Stack.Screen name={ROUTES.WORKFLOW_TEMPLATES} component={WorkflowTemplatesScreen} options={{ title: 'Templates' }} />
      <Stack.Screen name={ROUTES.APPROVAL_INBOX} component={ApprovalInboxScreen} options={{ title: 'Approval Inbox' }} />
      <Stack.Screen name={ROUTES.MY_TASKS} component={MyTasksScreen} options={{ title: 'My Tasks' }} />
      <Stack.Screen name={ROUTES.TASK_DETAILS} component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
      <Stack.Screen name={ROUTES.WORKFLOW_HISTORY} component={WorkflowHistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name={ROUTES.SIGNATURE_MANAGER} component={SignatureManagerScreen} options={{ title: 'Signatures' }} />
      <Stack.Screen name={ROUTES.AUTOMATION_RULES} component={AutomationRulesScreen} options={{ title: 'Automation Rules' }} />
    </Stack.Navigator>
  );
}
