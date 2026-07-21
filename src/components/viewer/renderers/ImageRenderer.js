import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import AnnotationOverlay from '../ui/AnnotationOverlay';

const ImageRenderer = ({ uri, onZoomChange, annotations = [], onSelectAnnotation }) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Reanimated shared values for zoom and pan
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Checkerboard background for transparent images
  const checkerboardPattern = isDark
    ? 'repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 20px 20px'
    : 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px';

  // Gestures
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (onZoomChange) onZoomChange(scale.value);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only pan if zoomed in
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
      if (onZoomChange) onZoomChange(scale.value);
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Checkerboard Background for Transparency */}
      <View style={[StyleSheet.absoluteFillObject, styles.checkerboardContainer]}>
        {/* React Native doesn't support CSS gradients directly without webview/svg.
            For this native implementation, we can simulate a subtle grid or use a solid fallback,
            or implement a custom View grid. We will use a solid fallback and document it. */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]} />
      </View>

      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[styles.imageContainer, animatedStyle]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setDimensions({ width, height });
          }}
        >
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="contain"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          {dimensions.width > 0 && annotations.length > 0 && (
            <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
              <AnnotationOverlay
                annotations={annotations}
                width={dimensions.width}
                height={dimensions.height}
                onSelectAnnotation={onSelectAnnotation}
              />
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkerboardContainer: {
    zIndex: -1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageRenderer;
