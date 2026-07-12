import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import ImportProgress from '../../services/import/ImportProgress';
import ImportService from '../../services/import/ImportService';
import { Modal, Portal, Button } from 'react-native-paper';


export const DuplicateResolutionDialog = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const [state, setState] = useState(ImportProgress.state);

  useEffect(() => {
    const unsubscribe = ImportProgress.subscribe(setState);
    return () => unsubscribe();
  }, []);

  if (!state.duplicateContext) {
    return null;
  }

  const { job, duplicateInfo } = state.duplicateContext;

  const handleResolve = (strategy) => {
    ImportService.resolveDuplicate(job.id, strategy);
  };

  return (
    <Portal>
      <Modal visible={true} dismissable={false} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing[24] }]}>
        <Text style={[styles.title, { color: colors.text, marginBottom: spacing[16] }]}>File Already Exists</Text>

        <Text style={{ color: colors.text, marginBottom: spacing[8] }}>
          A file named &quot;{job.file.name}&quot; already exists in this location.
        </Text>

        <View style={[styles.infoBox, { backgroundColor: colors.background, padding: spacing[16], borderRadius: borderRadius.md, marginBottom: spacing[24] }]}>
           <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Incoming: {Math.round(job.file.size / 1024)} KB</Text>
           <Text style={{ color: colors.textSecondary }}>Existing: {Math.round(duplicateInfo.size / 1024)} KB</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => handleResolve('replace')} style={[styles.button, { backgroundColor: colors.primary, marginBottom: spacing[12] }]}>
             Replace Existing
          </Button>
          <Button mode="outlined" onPress={() => handleResolve('keepBoth')} style={[styles.button, { borderColor: colors.primary, marginBottom: spacing[12] }]}>
             Keep Both
          </Button>
          <Button mode="text" onPress={() => handleResolve('skip')} style={styles.button}>
             Skip
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBox: {
    //
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  }
});
