import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, FAB, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import WorkspaceService from '../../services/collaboration/WorkspaceService';

export default function WorkspaceDashboardScreen() {
  const { colors, spacing } = useTheme();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // For this local/offline mockup we assume a fixed local userId
  const userId = 'local_user_1';

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await WorkspaceService.getWorkspaces(userId);
        setWorkspaces(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async () => {
    try {
      await WorkspaceService.createWorkspace('New Workspace', 'A fresh collaboration space', userId);
      const data = await WorkspaceService.getWorkspaces(userId);
      setWorkspaces(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing[32] }} />
      ) : (
        <ScrollView>
          <List.Section>
            {workspaces.length === 0 ? (
              <Text style={[{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing[32] }]}>
                No workspaces found.
              </Text>
            ) : (
              workspaces.map(ws => (
                <List.Item
                  key={ws.id}
                  title={ws.name}
                  description={ws.description || 'No description'}
                  left={props => <List.Icon {...props} icon="briefcase" />}
                />
              ))
            )}
          </List.Section>
        </ScrollView>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        color={colors.background}
        onPress={handleCreateWorkspace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
