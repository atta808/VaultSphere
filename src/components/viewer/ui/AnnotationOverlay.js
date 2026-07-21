import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Circle, Path, Text as SvgText, G } from 'react-native-svg';

/**
 * AnnotationOverlay renders vector-based annotations over a document page.
 * It is resolution-independent, scaling with the provided width/height.
 */
const AnnotationOverlay = ({
  annotations = [],
  width,
  height,
  onSelectAnnotation
}) => {

  const renderAnnotation = (annotation) => {
    // Basic scaling logic, assumes annotations are stored as percentages (0-1)
    // or we'd need original document dimensions to map them.
    // For simplicity, let's assume they are stored in raw unscaled coordinates,
    // but here we render them. If they are percentages:
    const { x, y, width: aWidth, height: aHeight, type, color, content } = annotation;
    const key = annotation.id;

    // A real implementation would handle scaling correctly based on zoomLevel and pan.
    // For this demonstration, we'll map directly if they are within [0,1], otherwise use directly.
    const isPercentage = x <= 1 && y <= 1;
    const left = isPercentage ? x * width : x;
    const top = isPercentage ? y * height : y;
    const w = isPercentage ? aWidth * width : aWidth;
    const h = isPercentage ? aHeight * height : aHeight;

    const strokeColor = color || 'rgba(255, 200, 0, 0.8)';
    const fillColor = type === 'highlight' ? 'rgba(255, 235, 59, 0.4)' : 'transparent';
    const strokeW = type === 'highlight' ? 0 : 2;

    switch (type) {
      case 'highlight':
      case 'rectangle':
        return (
          <Rect
            key={key}
            x={left}
            y={top}
            width={w}
            height={h}
            fill={fillColor}
            stroke={type === 'rectangle' ? strokeColor : 'transparent'}
            strokeWidth={strokeW}
            onPress={() => onSelectAnnotation && onSelectAnnotation(annotation)}
          />
        );
      case 'circle':
        return (
          <Circle
            key={key}
            cx={left + w / 2}
            cy={top + h / 2}
            r={Math.min(w, h) / 2}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={2}
            onPress={() => onSelectAnnotation && onSelectAnnotation(annotation)}
          />
        );
      case 'note':
        return (
          <G key={key} x={left} y={top} onPress={() => onSelectAnnotation && onSelectAnnotation(annotation)}>
            <Rect x={0} y={0} width={24} height={24} fill="#ffeb3b" stroke="#fbc02d" strokeWidth={1} />
            <SvgText x={12} y={16} fontSize={12} textAnchor="middle" fill="#000">T</SvgText>
          </G>
        );
      case 'drawing':
      case 'freehand':
        // content would be an SVG path string for freehand
        return (
          <Path
            key={key}
            d={content || `M ${left} ${top} L ${left + w} ${top + h}`}
            stroke={strokeColor}
            strokeWidth={3}
            fill="transparent"
            onPress={() => onSelectAnnotation && onSelectAnnotation(annotation)}
          />
        );
      case 'underline':
        return (
          <Rect
            key={key}
            x={left}
            y={top + h - 2}
            width={w}
            height={2}
            fill={strokeColor}
          />
        );
      case 'strike-through':
        return (
          <Rect
            key={key}
            x={left}
            y={top + h / 2 - 1}
            width={w}
            height={2}
            fill={strokeColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[StyleSheet.absoluteFillObject, { width, height }]} pointerEvents="box-none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {annotations.map(renderAnnotation)}
      </Svg>
    </View>
  );
};

export default AnnotationOverlay;
