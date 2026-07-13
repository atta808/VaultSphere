import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumInput } from '../../components/forms/PremiumInput';
import { PremiumButton } from '../../components/buttons/PremiumButton';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import { validatePinFormat } from '../../utils/pinValidation';

export const CreatePinScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!validatePinFormat(pin)) {
      setError('PIN must be 4-8 digits.');
      return;
    }
    setError('');
    navigation.navigate('ConfirmPin', { pin });
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { padding: spacing[24] }]}>
        <View style={styles.header}>
            <Text style={[typography.h2, { color: colors.text.primary, marginBottom: spacing[8], textAlign: 'center' }]}>
            Create a PIN
            </Text>
            <Text style={[typography.body1, { color: colors.text.secondary, textAlign: 'center' }]}>
            Enter a 4-8 digit PIN to secure your app.
            </Text>
        </View>

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
            onSubmitEditing={handleNext}
            autoFocus
        />

        <PremiumButton
            title="Next"
            onPress={handleNext}
            disabled={pin.length < 4}
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
