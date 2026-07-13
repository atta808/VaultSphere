import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import OCRResultRepository from '../../database/repositories/OCRResultRepository';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import OCRQueue from '../../ai/queue/OCRQueue';

export function OCRBadge({ documentId }) {
  const { colors, spacing } = useTheme();
  const [status, setStatus] = useState('pending'); // 'pending', 'processing', 'completed', 'none'

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const result = await OCRResultRepository.findOne({ documentId });
        if (!mounted) return;
        if (result) {
          setStatus('completed');
        } else {
           // Check if it's in the queue
           const isInQueue = OCRQueue.queue.some(j => j.documentId === documentId);
           if (isInQueue) {
               setStatus(OCRQueue.isProcessing && OCRQueue.queue[0]?.documentId === documentId ? 'processing' : 'pending');
           } else {
               setStatus('none');
           }
        }
      } catch (_e) {
        if (mounted) setStatus('none');
      }
    }

    checkStatus();

    // Listen to queue events to update badge dynamically
    const updateFromQueue = () => {
      checkStatus();
    };

    const unsubCompleted = OCRQueue.on('OCR_COMPLETED', updateFromQueue);
    const unsubStarted = OCRQueue.on('OCR_STARTED', updateFromQueue);
    const unsubAdded = OCRQueue.on('QUEUE_UPDATED', updateFromQueue);

    return () => {
      mounted = false;
      unsubCompleted();
      unsubStarted();
      unsubAdded();
    };
  }, [documentId]);

  if (status === 'none') return null;

  let icon = 'time-outline';
  let bgColor = colors.surfaceHover;
  let textColor = colors.textSecondary;
  let text = 'Queued';

  if (status === 'processing') {
    icon = 'sync-outline';
    bgColor = colors.primary + '33';
    textColor = colors.primary;
    text = 'AI Processing';
  } else if (status === 'completed') {
    icon = 'scan-outline';
    bgColor = colors.success ? colors.success + '33' : colors.primary + '33';
    textColor = colors.text;
    text = 'AI Indexed';
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bgColor, paddingHorizontal: spacing[8], paddingVertical: spacing[4], borderRadius: 12, alignSelf: 'flex-start', marginTop: spacing[4] }}>
      <Ionicons name={icon} size={12} color={textColor} style={{ marginRight: spacing[4] }} />
      <Text style={{ fontSize: 10, color: textColor, fontWeight: 'bold' }}>{text}</Text>
    </View>
  );
}
