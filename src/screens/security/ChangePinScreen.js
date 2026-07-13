import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumInput } from '../../components/forms/PremiumInput';
import { PremiumButton } from '../../components/buttons/PremiumButton';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import { validatePinFormat } from '../../utils/pinValidation';

export const ChangePinScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const oldPin = route.params?.oldPin; // Passed from VerifyPinScreen

  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!validatePinFormat(newPin)) {
      setError('PIN must be 4-8 digits.');
      return;
    }
    if (newPin === oldPin) {
        setError('New PIN must be different from current PIN.');
        return;
    }
    setError('');
    navigation.navigate('ConfirmPin', { pin: newPin, oldPin, isChangingPin: true });
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { padding: spacing[24] }]}>
        <View style={styles.header}>
            <Text style={[typography.h2, { color: colors.text.primary, marginBottom: spacing[8], textAlign: 'center' }]}>
            Create New PIN
            </Text>
            <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
            Enter your new 4-8 digit PIN.
            </Text>
        </View>

        <PremiumInput
            label="New PIN"
            value={newPin}
            onChangeText={(val) => {
                setNewPin(val);
                setError('');
            }}
            secureTextEntry
            keyboardType="numeric"
            maxLength={8}
            error={error}
            placeholder="Enter New PIN"
            returnKeyType="done"
            onSubmitEditing={handleNext}
            autoFocus
        />

        <PremiumButton
            title="Next"
            onPress={handleNext}
            disabled={newPin.length < 4}
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
