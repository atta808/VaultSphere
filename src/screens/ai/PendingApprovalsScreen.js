import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, DeviceEventEmitter } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import ToolExecutionService from '../../services/agent/tools/ToolExecutionService';

export default function PendingApprovalsScreen({ navigation }) {
  const theme = useTheme();
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    // Populate with existing pending approvals
    const existing = Array.from(ToolExecutionService.pendingApprovals.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
    setApprovals(existing);

    // Listen for new approvals
    const sub = DeviceEventEmitter.addListener('AGENT_APPROVAL_REQUIRED', (data) => {
      setApprovals(prev => [...prev, {
        id: data.approvalId,
        tool: { name: data.toolName, description: data.description },
        inputs: data.inputs
      }]);
    });

    return () => sub.remove();
  }, []);

  const handleApprove = async (id) => {
    try {
      await ToolExecutionService.approveExecution(id);
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Failed to approve', e);
    }
  };

  const handleReject = async (id) => {
    try {
      await ToolExecutionService.rejectExecution(id);
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error('Failed to reject', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pending Approvals" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {approvals.length === 0 ? (
          <Title style={styles.emptyText}>No pending approvals.</Title>
        ) : (
          approvals.map((approval) => (
            <Card key={approval.id} style={styles.card}>
              <Card.Content>
                <Title>{approval.tool.name}</Title>
                <Paragraph>{approval.tool.description}</Paragraph>
                <Paragraph style={styles.inputs}>
                  Inputs: {JSON.stringify(approval.inputs)}
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleReject(approval.id)} color={theme.colors.error}>Reject</Button>
                <Button onPress={() => handleApprove(approval.id)} mode="contained">Approve</Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 16 },
  inputs: { marginTop: 8, fontStyle: 'italic', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 32, opacity: 0.6 }
});
