import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import AIWorkspaceScreen from '../screens/ai/AIWorkspaceScreen';
import ComparisonScreen from '../screens/ai/ComparisonScreen';
import AIAgentHubScreen from '../screens/ai/AIAgentHubScreen';
import AgentManagerScreen from '../screens/ai/AgentManagerScreen';
import AutomationHubScreen from '../screens/ai/AutomationHubScreen';
import ScheduledJobsScreen from '../screens/ai/ScheduledJobsScreen';
import AIInsightsScreen from '../screens/ai/AIInsightsScreen';
import PromptLibraryScreen from '../screens/ai/PromptLibraryScreen';
import AgentActivityScreen from '../screens/ai/AgentActivityScreen';
import ExecutionHistoryScreen from '../screens/ai/ExecutionHistoryScreen';
import PendingApprovalsScreen from '../screens/ai/PendingApprovalsScreen';

const Stack = createNativeStackNavigator();

export default function AIWorkspaceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.AI_WORKSPACE} component={AIWorkspaceScreen} />
      <Stack.Screen name={ROUTES.COMPARISON_SCREEN} component={ComparisonScreen} />

      {/* Phase 19 screens */}
      <Stack.Screen name={ROUTES.AI_AGENT_HUB} component={AIAgentHubScreen} />
      <Stack.Screen name={ROUTES.AGENT_MANAGER} component={AgentManagerScreen} />
      <Stack.Screen name={ROUTES.AUTOMATION_HUB} component={AutomationHubScreen} />
      <Stack.Screen name={ROUTES.SCHEDULED_JOBS} component={ScheduledJobsScreen} />
      <Stack.Screen name={ROUTES.AI_INSIGHTS} component={AIInsightsScreen} />
      <Stack.Screen name={ROUTES.PROMPT_LIBRARY} component={PromptLibraryScreen} />
      <Stack.Screen name={ROUTES.AGENT_ACTIVITY} component={AgentActivityScreen} />
      <Stack.Screen name={ROUTES.EXECUTION_HISTORY} component={ExecutionHistoryScreen} />
      <Stack.Screen name={ROUTES.PENDING_APPROVALS} component={PendingApprovalsScreen} />
    </Stack.Navigator>
  );
}
