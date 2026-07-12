import React, { useState } from 'react';
import { View, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { SpherePageHeader } from '../components/headers/SpherePageHeader';
import { SphereSectionCard } from '../components/cards/SphereSectionCard';
import { SphereListItem } from '../components/lists/SphereListItem';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../config/routes';

export default function SettingsScreen() {
  const navigation = useNavigation();
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
