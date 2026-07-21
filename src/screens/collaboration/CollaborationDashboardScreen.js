import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { ROUTES } from '../../config/routes';
import { useTheme } from '../../hooks/useTheme';

export default function CollaborationDashboardScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <List.Section>
        <List.Subheader style={{ color: colors.text.secondary }}>Workspaces</List.Subheader>
        <List.Item
          title="My Workspaces"
          left={props => <List.Icon {...props} icon="briefcase" />}
          onPress={() => navigation.navigate(ROUTES.WORKSPACE_DASHBOARD)}
        />
        <List.Subheader style={{ color: colors.text.secondary }}>Sharing</List.Subheader>
        <List.Item
          title="Shared With Me"
          left={props => <List.Icon {...props} icon="account-arrow-left" />}
          onPress={() => navigation.navigate(ROUTES.SHARED_WITH_ME)}
        />
        <List.Item
          title="Shared By Me"
          left={props => <List.Icon {...props} icon="account-arrow-right" />}
          onPress={() => navigation.navigate(ROUTES.SHARED_BY_ME)}
        />
        <List.Subheader style={{ color: colors.text.secondary }}>Logs & Activity</List.Subheader>
        <List.Item
          title="Activity Timeline"
          left={props => <List.Icon {...props} icon="timeline-text" />}
          onPress={() => navigation.navigate(ROUTES.ACTIVITY_TIMELINE)}
        />
        <List.Item
          title="Audit Trail"
          left={props => <List.Icon {...props} icon="shield-search" />}
          onPress={() => navigation.navigate(ROUTES.AUDIT_TRAIL)}
        />
        <List.Item
          title="Notifications Center"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS_CENTER)}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
