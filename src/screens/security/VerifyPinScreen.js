import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumInput } from '../../components/forms/PremiumInput';
import { PremiumButton } from '../../components/buttons/PremiumButton';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import SecurityService from '../../services/security/SecurityService';

// Used as a generic "Enter Current PIN" screen before allowing sensitive actions (like turning off lock, or changing PIN)
export const VerifyPinScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const onSuccess = route.params?.onSuccess;
  const actionLabel = route.params?.actionLabel || 'Verify';
  const reason = route.params?.reason || 'Enter your current PIN to continue.';

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    checkLockoutState();
    const interval = setInterval(checkLockoutState, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLockoutState = () => {
    const isLocked = SecurityService.pin.isLockedOut();
    setIsLockedOut(isLocked);
    if (isLocked) {
        setLockoutTime(SecurityService.pin.getRemainingLockoutTime());
    } else {
        setLockoutTime(0);
        setError('');
    }
  };

  const handleVerify = async () => {
    if (!pin) return;
    setError('');

    try {
      const isValid = await SecurityService.pin.verifyPin(pin);
      if (isValid) {
          if (onSuccess) {
              // Pass the validated pin back in case it's needed (e.g. for change pin flow)
              onSuccess(pin);
          } else {
              navigation.goBack();
          }
      } else {
          setError('Invalid PIN');
          setPin('');
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
            Verify PIN
            </Text>
            <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
            {reason}
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
                    label="Current PIN"
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
                    onSubmitEditing={handleVerify}
                    autoFocus
                />

                <PremiumButton
                    title={actionLabel}
                    onPress={handleVerify}
                    disabled={pin.length < 4}
                    style={{ marginTop: spacing[24] }}
                />
            </>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  header: {
      marginBottom: 32,
  },
  errorContainer: {
      marginBottom: 24,
  }
});
