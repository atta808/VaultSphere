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
import { useAuthentication } from '../context/AuthenticationContext';
import SecurityService from '../services/security/SecurityService';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { hasPinSetup, lock } = useAuthentication();
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

  const [notifications, setNotifications] = useState(true);

  // Security States
  const [appLock, setAppLock] = useState(false);
  const [vaultLock, setVaultLock] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [autoLockTimeout, setAutoLockTimeout] = useState(5 * 60 * 1000);

  useFocusEffect(
    useCallback(() => {
      loadSecuritySettings();
    }, [])
  );

  const loadSecuritySettings = async () => {
    const isAppLock = await SecurityService.settings.isAppLockEnabled();
    const isVaultLock = await SecurityService.settings.isVaultLockEnabled();
    const isBioEnabled = await SecurityService.biometrics.isBiometricEnabledByUser();
    const isBioAvail = await SecurityService.biometrics.checkHardwareAvailability();
    const timeout = await SecurityService.settings.getAutoLockTimeout();

    setAppLock(isAppLock);
    setVaultLock(isVaultLock);
    setBiometricsEnabled(isBioEnabled);
    setBiometricAvailable(isBioAvail);
    setAutoLockTimeout(timeout);
  };

  const handleToggleAppLock = async (val) => {
      if (val && !hasPinSetup) {
          // Force PIN setup first
          navigation.navigate(ROUTES.SECURITY_STACK, { screen: ROUTES.CREATE_PIN });
          return;
      }
      await SecurityService.settings.setAppLockEnabled(val);
      setAppLock(val);
  };

  const handleToggleVaultLock = async (val) => {
      if (val && !hasPinSetup) {
          navigation.navigate(ROUTES.SECURITY_STACK, { screen: ROUTES.CREATE_PIN });
          return;
      }
      await SecurityService.settings.setVaultLockEnabled(val);
      setVaultLock(val);
  };

  const handleToggleBiometrics = async (val) => {
      if (val && !hasPinSetup) {
          navigation.navigate(ROUTES.SECURITY_STACK, { screen: ROUTES.CREATE_PIN });
          return;
      }

      if (val) {
          // Verify they can actually use it before enabling
          const isEnrolled = await SecurityService.biometrics.checkEnrollment();
          if (!isEnrolled) {
              alert('Biometrics are not enrolled on this device.');
              return;
          }
      }

      await SecurityService.biometrics.setBiometricPreference(val);
      setBiometricsEnabled(val);
  };

  const handleChangePin = () => {
      if (!hasPinSetup) {
          navigation.navigate(ROUTES.SECURITY_STACK, { screen: ROUTES.CREATE_PIN });
      } else {
          navigation.navigate(ROUTES.SECURITY_STACK, {
              screen: ROUTES.VERIFY_PIN,
              params: {
                  reason: 'Verify your current PIN before changing it.',
                  onSuccess: (oldPin) => {
                      navigation.navigate(ROUTES.SECURITY_STACK, {
                          screen: ROUTES.CHANGE_PIN,
                          params: { oldPin }
                      });
                  }
              }
          });
      }
  };

  const getAutoLockLabel = (timeout) => {
      if (timeout === -1) return 'Never';
      if (timeout === 0) return 'Immediately';
      if (timeout === 30000) return '30 Seconds';
      if (timeout === 60000) return '1 Minute';
      if (timeout === 300000) return '5 Minutes';
      if (timeout === 600000) return '10 Minutes';
      if (timeout === 1800000) return '30 Minutes';
      return 'Unknown';
  };

  const cycleAutoLock = async () => {
      // Simple cycle for now (0 -> 30s -> 1m -> 5m -> 10m -> 30m -> Never -> 0)
      const options = [0, 30000, 60000, 300000, 600000, 1800000, -1];
      const currentIndex = options.indexOf(autoLockTimeout);
      const nextIndex = (currentIndex + 1) % options.length;
      const nextValue = options[nextIndex];

      await SecurityService.settings.setAutoLockTimeout(nextValue);
      setAutoLockTimeout(nextValue);
  };


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
            title="Application Lock"
            subtitle="Require PIN/Biometrics to open app"
            icon="lock-closed"
            showDivider
            rightContent={
              <Switch value={appLock} onValueChange={handleToggleAppLock} trackColor={{ true: colors.primary }} />
            }
          />
          <SphereListItem
            title="Vault Lock"
            subtitle="Require PIN/Biometrics to open Vault"
            icon="shield-checkmark"
            showDivider
            rightContent={
              <Switch value={vaultLock} onValueChange={handleToggleVaultLock} trackColor={{ true: colors.primary }} />
            }
          />

          {biometricAvailable && (
              <SphereListItem
                title="Enable Biometrics"
                subtitle="Use Face ID / Touch ID"
                icon="finger-print"
                showDivider
                rightContent={
                  <Switch value={biometricsEnabled} onValueChange={handleToggleBiometrics} trackColor={{ true: colors.primary }} />
                }
              />
          )}

          <SphereListItem
            title="Auto Lock"
            subtitle={getAutoLockLabel(autoLockTimeout)}
            icon="timer"
            showDivider
            onPress={cycleAutoLock}
          />

          <SphereListItem
            title={hasPinSetup ? "Change PIN" : "Create PIN"}
            icon="keypad"
            showDivider
            onPress={handleChangePin}
          />

          {hasPinSetup && (
              <SphereListItem
                title="Lock Now"
                icon="lock-closed-outline"
                onPress={lock}
              />
          )}
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
