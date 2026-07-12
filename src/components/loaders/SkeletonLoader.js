import React, { memo, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const SkeletonLoader = memo(({
  width = '100%',
  height = 20,
  rounded = true,
  circle = false,
  style,
  testID,
}) => {
  const { colors, radius } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border,
          opacity,
          borderRadius: circle ? height / 2 : rounded ? radius.md : 0,
        },
        style,
      ]}
      testID={testID}
    />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';
