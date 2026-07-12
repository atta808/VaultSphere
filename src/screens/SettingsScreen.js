import React, { useState , useCallback } from 'react';
import { View, Switch } from 'react-native';
import { useNavigation , useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereListItem } from '../components/lists/SphereListItem';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';
import VaultService from '../services/vault/VaultService';
import { useDatabase } from '../database/DatabaseProvider';
import { SphereInfoRow } from '../components/common/SphereInfoRow';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { databaseReady } = useDatabase();
  const [stats, setStats] = useState({
    usedDocs: 0,
    usedTrash: 0,
    usedTemp: 0,
    totalUsed: 0,
    freeSpace: 0,
    totalSpace: 0
  });

  useFocusEffect(
    useCallback(() => {
      VaultService.getVaultStatistics().then(setStats).catch(console.error);
    }, [])
  );

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const { isDark, toggleTheme, colors, spacing } = useTheme();

  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <ScreenContainer scrollable>
      <SpherePageHeader title="Settings" />

      <SphereSectionCard title="Account">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Profile"
            subtitle="Manage your personal information"
            icon="person"
            onPress={() => navigation.navigate(ROUTES.PROFILE)}
            showDivider
          />
          <SphereListItem
            title="Subscription"
            subtitle="Free Plan"
            icon="star"
            onPress={() => {}}
          />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="Appearance">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Dark Mode"
            icon="moon"
            rightContent={
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: colors.primary }} />
            }
          />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="Security">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Biometric Authentication"
            subtitle="Unlock with Face ID / Touch ID"
            icon="finger-print"
            showDivider
            rightContent={
              <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ true: colors.primary }} />
            }
          />
          <SphereListItem
            title="Change PIN"
            icon="keypad"
            onPress={() => {}}
          />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="Notifications">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Push Notifications"
            icon="notifications"
            rightContent={
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />
            }
          />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="Database & Storage">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereInfoRow label="Status" value={databaseReady ? 'Connected' : 'Disconnected'} />
          <SphereInfoRow label="Provider" value="expo-sqlite" />
          <SphereInfoRow label="Documents" value={formatSize(stats.usedDocs)} />
          <SphereInfoRow label="Trash" value={formatSize(stats.usedTrash)} />
          <SphereInfoRow label="Temp" value={formatSize(stats.usedTemp)} />
          <SphereInfoRow label="Total Used" value={formatSize(stats.totalUsed)} />
          <SphereInfoRow label="Free Space" value={formatSize(stats.freeSpace)} showDivider={false} />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="Backup">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Cloud Backup"
            subtitle="Last backup: Never"
            icon="cloud-upload"
            onPress={() => {}}
          />
        </View>
      </SphereSectionCard>

      <SphereSectionCard title="About">
        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
          <SphereListItem
            title="Help & Support"
            icon="help-circle"
            onPress={() => {}}
            showDivider
          />
          <SphereListItem
            title="Privacy Policy"
            icon="shield-checkmark"
            onPress={() => {}}
            showDivider
          />
          <SphereListItem
            title="Terms of Service"
            icon="document-text"
            onPress={() => {}}
            showDivider
          />
          <SphereListItem
            title="Version"
            subtitle="1.0.0"
            icon="information-circle"
            rightIcon={null}
          />
        </View>
      </SphereSectionCard>

      <View style={{ height: spacing[32] }} />
    </ScreenContainer>
  );
}
