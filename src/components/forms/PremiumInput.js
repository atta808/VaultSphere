import React, { memo, forwardRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

export const PremiumInput = memo(forwardRef(({
  label,
  helper,
  error,
  password = false,
  leftIcon,
  rightIcon,
  disabled = false,
  multiline = false,
  style,
  containerStyle,
  testID,
  ...rest
}, ref) => {
  const { colors, typography, spacing, radius } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const currentRightIcon = password ? (
    <PaperTextInput.Icon
      icon={isPasswordVisible ? 'eye-off' : 'eye'}
      onPress={togglePasswordVisibility}
    />
  ) : rightIcon ? (
    <PaperTextInput.Icon icon={rightIcon} />
  ) : null;

  const currentLeftIcon = leftIcon ? <PaperTextInput.Icon icon={leftIcon} /> : null;

  return (
    <View style={[styles.container, containerStyle]}>
      <PaperTextInput
        ref={ref}
        mode="outlined"
        label={label}
        disabled={disabled}
        multiline={multiline}
        secureTextEntry={password && !isPasswordVisible}
        left={currentLeftIcon}
        right={currentRightIcon}
        outlineColor={error ? colors.danger : colors.border}
        activeOutlineColor={error ? colors.danger : colors.primary}
        textColor={colors.text.primary}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            ...typography.body,
          },
          style
        ]}
        theme={{
          roundness: radius.md,
          colors: {
            onSurfaceVariant: colors.text.secondary, // placeholder and inactive label color
            error: colors.danger,
          }
        }}
        error={!!error}
        testID={testID}
        {...rest}
      />
      {(helper || error) && (
        <Text
          style={[
            typography.caption,
            {
              marginTop: spacing[4],
              marginLeft: spacing[4],
              color: error ? colors.danger : colors.text.secondary
            }
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}));

PremiumInput.displayName = 'PremiumInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
});
