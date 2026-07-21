import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../config/routes';
import { useTheme } from '../hooks/useTheme';

import CollaborationDashboardScreen from '../screens/collaboration/CollaborationDashboardScreen';
import SharedWithMeScreen from '../screens/collaboration/SharedWithMeScreen';
import SharedByMeScreen from '../screens/collaboration/SharedByMeScreen';
import WorkspaceDashboardScreen from '../screens/collaboration/WorkspaceDashboardScreen';
import ActivityTimelineScreen from '../screens/collaboration/ActivityTimelineScreen';
import AuditTrailScreen from '../screens/collaboration/AuditTrailScreen';
import VersionHistoryScreen from '../screens/collaboration/VersionHistoryScreen';
import PermissionManagerScreen from '../screens/collaboration/PermissionManagerScreen';
import CollaborationDetailsScreen from '../screens/collaboration/CollaborationDetailsScreen';
import NotificationsCenterScreen from '../screens/collaboration/NotificationsCenterScreen';

const Stack = createNativeStackNavigator();

export default function CollaborationStack() {
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
      <Stack.Screen name={ROUTES.COLLABORATION_DASHBOARD} component={CollaborationDashboardScreen} options={{ title: 'Collaboration' }} />
      <Stack.Screen name={ROUTES.SHARED_WITH_ME} component={SharedWithMeScreen} options={{ title: 'Shared With Me' }} />
      <Stack.Screen name={ROUTES.SHARED_BY_ME} component={SharedByMeScreen} options={{ title: 'Shared By Me' }} />
      <Stack.Screen name={ROUTES.WORKSPACE_DASHBOARD} component={WorkspaceDashboardScreen} options={{ title: 'Workspace Dashboard' }} />
      <Stack.Screen name={ROUTES.ACTIVITY_TIMELINE} component={ActivityTimelineScreen} options={{ title: 'Activity Timeline' }} />
      <Stack.Screen name={ROUTES.AUDIT_TRAIL} component={AuditTrailScreen} options={{ title: 'Audit Trail' }} />
      <Stack.Screen name={ROUTES.VERSION_HISTORY} component={VersionHistoryScreen} options={{ title: 'Version History' }} />
      <Stack.Screen name={ROUTES.PERMISSION_MANAGER} component={PermissionManagerScreen} options={{ title: 'Permission Manager' }} />
      <Stack.Screen name={ROUTES.COLLABORATION_DETAILS} component={CollaborationDetailsScreen} options={{ title: 'Collaboration Details' }} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS_CENTER} component={NotificationsCenterScreen} options={{ title: 'Notifications Center' }} />
    </Stack.Navigator>
  );
}
