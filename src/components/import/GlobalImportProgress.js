import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import ImportProgress from '../../services/import/ImportProgress';
import ImportQueue from '../../services/import/ImportQueue';
import { Ionicons } from '@expo/vector-icons';
import { Surface, ProgressBar } from 'react-native-paper';

export const GlobalImportProgress = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const [state, setState] = useState(ImportProgress.state);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const unsubscribe = ImportProgress.subscribe(setState);
    return () => unsubscribe();
  }, []);

  if (!state.visible && state.stats.total === 0) {
    return null; // Don't show if nothing to show
  }

  // If we are done but still visible, show a summary
  if (state.stats.total > 0 && state.stats.total === (state.stats.completed + state.stats.failed + state.stats.skipped + state.stats.cancelled) && !state.currentJob) {
      return (
        <Surface style={[styles.container, { backgroundColor: colors.surface, bottom: spacing[24], borderRadius: borderRadius.lg }]} elevation={4}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
             <Text style={[styles.title, { color: colors.text }]}>Import Complete</Text>
             <TouchableOpacity onPress={() => ImportProgress.hide()}>
               <Ionicons name="close" size={24} color={colors.textSecondary} />
             </TouchableOpacity>
          </View>
          <View style={styles.content}>
             <Text style={{ color: colors.textSecondary }}>Imported: {state.stats.completed}</Text>
             {state.stats.failed > 0 && <Text style={{ color: colors.error }}>Failed: {state.stats.failed}</Text>}
             {state.stats.skipped > 0 && <Text style={{ color: colors.warning }}>Skipped: {state.stats.skipped}</Text>}
             {state.stats.cancelled > 0 && <Text style={{ color: colors.textSecondary }}>Cancelled: {state.stats.cancelled}</Text>}
          </View>
        </Surface>
      );
  }

  if (!state.visible || !state.currentJob) {
      return null;
  }

  const { currentJob, stats } = state;
  const progressPercent = stats.total > 0 ? (stats.completed + stats.failed + stats.skipped + stats.cancelled) / stats.total : 0;
  const currentIndex = (stats.completed + stats.failed + stats.skipped + stats.cancelled) + 1;

  if (minimized) {
      return (
          <TouchableOpacity
             style={[styles.minimizedContainer, { backgroundColor: colors.primary, bottom: spacing[24], borderRadius: borderRadius.full }]}
             onPress={() => setMinimized(false)}
          >
             <Ionicons name="cloud-upload-outline" size={20} color={colors.onPrimary} />
             <Text style={{ color: colors.onPrimary, marginLeft: spacing[8] }}>Importing {currentIndex}/{stats.total}</Text>
          </TouchableOpacity>
      );
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface, bottom: spacing[24], borderRadius: borderRadius.lg }]} elevation={4}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Importing {currentIndex} of {stats.total}
        </Text>
        <View style={styles.actions}>
           <TouchableOpacity onPress={() => setMinimized(true)} style={{ marginRight: spacing[16] }}>
             <Ionicons name="chevron-down" size={24} color={colors.textSecondary} />
           </TouchableOpacity>
           <TouchableOpacity onPress={() => ImportQueue.cancelJob(currentJob.id)}>
             <Ionicons name="close-circle-outline" size={24} color={colors.textSecondary} />
           </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
          {currentJob.file.name}
        </Text>

        <ProgressBar progress={progressPercent} color={colors.primary} style={{ marginTop: spacing[12], height: 8, borderRadius: 4 }} />

        <View style={[styles.statsRow, { marginTop: spacing[12] }]}>
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
             {Math.round(progressPercent * 100)}%
          </Text>
          <TouchableOpacity onPress={() => ImportQueue.cancelAll()}>
              <Text style={{ color: colors.error, fontSize: 14 }}>Cancel All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 1000,
    overflow: 'hidden',
  },
  minimizedContainer: {
    position: 'absolute',
    left: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  fileName: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
  }
});
