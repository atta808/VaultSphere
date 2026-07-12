import React, { memo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const Divider = memo(({
  horizontal = true,
  color,
  thickness = 1,
  margin = 0,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const dividerColor = color || colors.border;

  const customStyle = [
    { backgroundColor: dividerColor },
    horizontal
      ? { height: thickness, width: '100%', marginVertical: margin }
      : { width: thickness, height: '100%', marginHorizontal: margin },
    style
  ];

  return <View style={customStyle} testID={testID} />;
});

Divider.displayName = 'Divider';
