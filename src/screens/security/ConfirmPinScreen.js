import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumInput } from '../../components/forms/PremiumInput';
import { PremiumButton } from '../../components/buttons/PremiumButton';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import SecurityService from '../../services/security/SecurityService';
import { useAuthentication } from '../../context/AuthenticationContext';

export const ConfirmPinScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { refreshPinSetupState } = useAuthentication();

  const initialPin = route.params?.pin;
  const isChangingPin = route.params?.isChangingPin; // Flow indicator

  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (confirmPin !== initialPin) {
      setError('PINs do not match.');
      setConfirmPin('');
      return;
    }

    setError('');

    try {
        if (isChangingPin) {
             const oldPin = route.params?.oldPin;
             await SecurityService.pin.changePin(oldPin, confirmPin);
        } else {
             await SecurityService.pin.createPin(confirmPin);
             // Enable App Lock by default when creating a PIN for the first time
             await SecurityService.settings.setAppLockEnabled(true);
        }

        await refreshPinSetupState();

        // Go back to the screen that initiated the flow (likely Settings)
        if (isChangingPin) {
             navigation.navigate('MainTabs', { screen: 'Settings' });
        } else {
             navigation.navigate('MainTabs');
        }

    } catch (err) {
        setError(err.message || 'Failed to save PIN.');
    }
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { padding: spacing[24] }]}>
        <View style={styles.header}>
            <Text style={[typography.h2, { color: colors.text.primary, marginBottom: spacing[8], textAlign: 'center' }]}>
            Confirm PIN
            </Text>
            <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
            Re-enter your PIN to confirm.
            </Text>
        </View>

        <PremiumInput
            label="Confirm PIN"
            value={confirmPin}
            onChangeText={(val) => {
                setConfirmPin(val);
                setError('');
            }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            error={error}
            placeholder="Re-enter PIN"
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            autoFocus
        />

        <PremiumButton
            title="Confirm"
            onPress={handleConfirm}
            disabled={confirmPin.length < 4}
            style={{ marginTop: spacing[24] }}
        />
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
  }
});
