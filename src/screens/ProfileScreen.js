import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereInfoRow } from '../components/common/SphereInfoRow';
import { EmptyState } from '../components/feedback/EmptyState';
import { useTheme } from '../hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import SecurityService from '../services/security/SecurityService';
import LocalStorageProvider from '../services/backup/providers/LocalStorageProvider';

export default function ProfileScreen() {
  const { spacing, colors, radius } = useTheme();
  const [securityStatus, setSecurityStatus] = React.useState('Loading...');
  const [biometricStatus, setBiometricStatus] = React.useState('Loading...');
  const [pinStatus, setPinStatus] = React.useState('Loading...');

  const [backupStatus, setBackupStatus] = React.useState('Loading...');
  const [lastBackup, setLastBackup] = React.useState('Loading...');

  useFocusEffect(
    React.useCallback(() => {
      loadStatuses();
    }, [])
  );

  const loadStatuses = async () => {
      const status = await SecurityService.settings.getSecurityStatus();
      setSecurityStatus(status);

      const hasPin = await SecurityService.pin.hasPinSetup();
      setPinStatus(hasPin ? 'Enabled' : 'Disabled');

      const isBioEnabled = await SecurityService.biometrics.isBiometricEnabledByUser();
      setBiometricStatus(isBioEnabled ? 'Enabled' : 'Disabled');

      try {
          const latest = await LocalStorageProvider.getLatestBackup();
          if (latest?.manifest) {
              setBackupStatus('Configured');
              setLastBackup(new Date(latest.manifest.createdDate).toLocaleDateString());
          } else {
              setBackupStatus('Not Configured');
              setLastBackup('Never');
          }
      } catch (e) {
          setBackupStatus('Unknown');
          setLastBackup('Unknown');
      }
  };

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Profile" />

      <View style={{ alignItems: 'center', marginBottom: spacing[32] }}>
        <View style={{ width: 100, height: 100, borderRadius: radius.round, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: spacing[16] }}>
           <EmptyState iconName="person" />
        </View>
        <SpherePageHeader title="John Doe" subtitle="john.doe@example.com" style={{ marginBottom: 0 }} />
      </View>

      <SphereSectionCard title="Account Details">
        <SphereInfoRow label="User ID" value="#8475839" />
        <SphereInfoRow label="Member Since" value="Oct 2023" />
        <SphereInfoRow label="Status" value="Active" showDivider={false} />
      </SphereSectionCard>

      <SphereSectionCard title="Security Status">
        <SphereInfoRow label="Overall Status" value={securityStatus} />
        <SphereInfoRow label="PIN Status" value={pinStatus} />
        <SphereInfoRow label="Biometric Status" value={biometricStatus} showDivider={false} />
      </SphereSectionCard>

      <SphereSectionCard title="Backup Status">
        <SphereInfoRow label="Backup Status" value={backupStatus} />
        <SphereInfoRow label="Last Backup" value={lastBackup} showDivider={false} />
      </SphereSectionCard>

      <SphereSectionCard title="Storage Usage">
        <SphereInfoRow label="Storage Utilized" value="Calculating..." showDivider={false} />
      </SphereSectionCard>

      <SphereSectionCard title="Statistics">
        <EmptyState
          iconName="bar-chart-outline"
          title="No Data"
          description="Statistics will appear here once you start using the vault."
        />
      </SphereSectionCard>

    </ScreenContainer>
  );
}
