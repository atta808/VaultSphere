import React, { useState, useEffect, useCallback } from 'react';
import { Logger } from '../../utils/logger/Logger';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumInput } from '../../components/forms/PremiumInput';
import { PremiumButton } from '../../components/buttons/PremiumButton';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import SecurityService from '../../services/security/SecurityService';

export const LockScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // onUnlock is a callback we can pass when locking specifically (e.g. VaultScreen)
  const onUnlock = route.params?.onUnlock;

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const checkLockoutState = useCallback(() => {
    const isLocked = SecurityService.pin.isLockedOut();
    setIsLockedOut(isLocked);
    if (isLocked) {
        setLockoutTime(SecurityService.pin.getRemainingLockoutTime());
    } else {
        setLockoutTime(0);
        setError('');
    }
  }, []);

  const handleBiometricAuth = useCallback(async () => {
    try {
      const success = await SecurityService.auth.authenticateWithBiometrics();
      if (success) {
        if (onUnlock) {
            onUnlock();
            navigation.goBack();
        } else {
            await SecurityService.session.startSession();
        }
      }
    } catch (err) {
      Logger.warn('Biometric auth failed gracefully', err);
    }
  }, [navigation, onUnlock]);

  useEffect(() => {
    // Only check once or in interval, but suppress the sync warning
    // by making sure we don't trigger cascades.
    let isMounted = true;
    const init = async () => {
       const isEnabled = await SecurityService.biometrics.isBiometricEnabledByUser();
       if (isMounted) setIsBiometricAvailable(isEnabled);
    };
    init();

    // Use a timeout to avoid sync state update in effect warning
    const timeout = setTimeout(() => {
        if (isMounted) checkLockoutState();
    }, 0);

    const interval = setInterval(() => {
        if (isMounted) checkLockoutState();
    }, 1000);

    return () => {
        isMounted = false;
        clearTimeout(timeout);
        clearInterval(interval);
    };
  }, [checkLockoutState]);

  // Automatically try biometric auth if it's enabled
  useEffect(() => {
    if (isBiometricAvailable && !isLockedOut) {
       handleBiometricAuth();
    }
  }, [isBiometricAvailable, isLockedOut, handleBiometricAuth]);

  const handlePinAuth = async () => {
    if (!pin) return;
    setError('');

    try {
      await SecurityService.auth.authenticateWithPin(pin);
      if (onUnlock) {
          onUnlock();
          navigation.goBack();
      } else {
          await SecurityService.session.startSession();
      }
    } catch (err) {
      setError(err.message || 'Invalid PIN');
      setPin('');
      checkLockoutState();
    }
  };

  const formatLockoutTime = (ms) => {
      const seconds = Math.ceil(ms / 1000);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { padding: spacing[24] }]}>
        <View style={styles.header}>
            <Text style={[typography.h2, { color: colors.text.primary, marginBottom: spacing[8], textAlign: 'center' }]}>
            Authentication Required
            </Text>
            <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
            Enter your PIN to continue.
            </Text>
        </View>

        {isLockedOut ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20', padding: spacing[16], borderRadius: 8 }]}>
                <Text style={[typography.body1, { color: colors.error, textAlign: 'center' }]}>
                    Too many failed attempts. Try again in {formatLockoutTime(lockoutTime)}.
                </Text>
            </View>
        ) : (
            <>
                <PremiumInput
                    label="PIN"
                    value={pin}
                    onChangeText={(val) => {
                        setPin(val);
                        setError('');
                    }}
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={8}
                    error={error}
                    placeholder="Enter PIN"
                    returnKeyType="done"
                    onSubmitEditing={handlePinAuth}
                />

                <PremiumButton
                    title="Unlock"
                    onPress={handlePinAuth}
                    disabled={pin.length < 4}
                    style={{ marginTop: spacing[24] }}
                />

                {isBiometricAvailable && (
                    <PremiumButton
                        title="Use Biometrics"
                        mode="outlined"
                        onPress={handleBiometricAuth}
                        style={{ marginTop: spacing[16] }}
                        icon="finger-print"
                    />
                )}
            </>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
      marginBottom: 32,
  },
  errorContainer: {
      marginBottom: 24,
  }
});
